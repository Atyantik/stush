/**
 * Created by ravindra on 21/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import CustomerSchema, { validator as CustomerSchemaValidator, formatCustomerData, previewProrationValidator, changeSubscriptionValidator, cancelSubscriptionValidator } from "./schema";
import Plan from "../plan/plan";
import Source from "../source/source";
import Refund from "../refund/refund";
import Invoice from "../invoice/invoice";
import Subscription from "../subscription/subscription";

export default class Customer {
  data = {};
  _stush = {};

  constructor(stushInstance, customerData) {
    this._stush= stushInstance;
    this.set(customerData, true);
  }

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    updatedData = formatCustomerData(updatedData);
    CustomerSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  async save() {
    try {
      let data = {};
      if (_.has(this.data, "id")) {
        debug("Updating Customer with: ", this.data);
        let params = CustomerSchemaValidator(this.data);
        data = await this._stush.stripe.customers.update(this.data.id, params.value);
      }
      else {
        debug("Creating Customer with: ", this.data);
        data = await this._stush.stripe.customers.create(this.data);
      }
      debug(data);
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Syncs the local customer from Stripe.
   * @returns {Promise.<*>}
   */
  async selfPopulate() {
    if (!this.data.id) {
      return Promise.reject(generateError("Please provide a valid customer ID before self populating"));
    }
    try {
      this.data = await this._stush.stripe.customers.retrieve(this.data.id);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Adds a source to customer.
   * @param sourceId
   * @returns {Promise.<*>}
   */
  async attachSource (sourceId) {
    try {
      const source = await this._stush.stripe.customers.createSource(this.data.id, {
        source: sourceId
      });
      return Promise.resolve(new Source(this._stush, source));
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Removes a source from customer. Falls back to removing card if source not found.
   * @param sourceId
   * @returns {Promise.<*>}
   */
  async detachSource (sourceId) {
    try {
      const source = await this._stush.stripe.customers.deleteSource(this.data.id, {
        source: sourceId
      });
      return Promise.resolve(new Source(this._stush, source));
    }
    catch (err) {
      if (_.has(err, "raw") && err.raw.param === "id" && _.startsWith(err.raw.message, "No such source")) {
        const source = await this._stush.stripe.customers.deleteCard(this.data.id, sourceId);
        return Promise.resolve(new Source(this._stush, source));
      }
      return Promise.reject(err);
    }
  }

  /**
   * Returns whether customer has any subscriptions.
   * @returns {boolean}
   */
  isSubscribed() {
    return _.get(this.data, "subscriptions.data.length", 0) !== 0;
  }

  /**
   * Returns the latest subscription of local customer instance if no argument is passed.
   * @param subscriptionId
   * @returns {Promise.<Subscription>}
   */
  async fetchSubscription(subscriptionId = null) {
    await this.selfPopulate();
    const subscriptions = _.get(this.data, "subscriptions");
    let requiredSubscription;
    if (subscriptionId) {
      for (let value of subscriptions.data) {
        if (subscriptionId === value.id) {
          requiredSubscription = value;
          break;
        }
      }
    }
    else {
      if (this._stush.fetchModel() === "multiple") {
        throw generateError("Subscription ID needs to be specified in Multiple Subscription Model.");
      }
      else {
        requiredSubscription = _.get(this.data, "subscriptions.data.[0]", null);
      }
    }
    if (!requiredSubscription) {
      throw generateError("Specified customer is not subscribed to subscription with provided ID.");
    }
    return Promise.resolve(new Subscription(this._stush, requiredSubscription));
  }

  /**
   * Fetches all the subscriptions on local customer instance.
   * @returns {Set}
   */
  fetchAllSubscriptions () {
    const subscriptions = _.get(this.data, "subscriptions.data");
    let set = new Set();
    for (let subscription of subscriptions) {
      set.add(new Subscription(this._stush, subscription));
    }
    return set;
  }

  /**
   * Adds a new subscription to customer.
   * @param subscriptionObj
   * @returns {Promise.<*>}
   */
  async addSubscription(subscriptionObj) {
    try {
      if (!this.data.id) {
        return Promise.reject(generateError("Please provide a valid customer ID to add a new subscription."));
      }
      let subscription = subscriptionObj.clone();
      _.set(subscription, "data.customer", this.data.id);
      await subscription.save();
      return Promise.resolve(subscription);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async endSubscription(subscription = null) {
    try {
      if (!subscription && this._stush.fetchModel() === "multiple") {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Subscription is required in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      let response = {}, refundParams = {}, input = cancelSubscriptionValidator(_.get(subscription, "data", {}));
      const atPeriodEnd = input.value.cancel === "after_billing_cycle";
      subscription = _.has(input, "value.subscription") ? await this.fetchSubscription(input.value.subscription) : await this.fetchSubscription();
      // Check input with stush configuration options.
      const prorationEnabled = this._stush.fetchProrationSetting();
      if (prorationEnabled && !atPeriodEnd && (_.has(input, "value.refund") || _.has(input, "value.refund_value_from"))) {
        debug("See this only with proration enabled.");
        // Fetch last invoice on this subscription for charge ID
        const invoice = await this.fetchAnInvoice({
          subscription: subscription.data.id
        });
        _.set(refundParams, "charge", _.get(invoice, "data.charge"));
        if (_.has(input, "value.refund")) {
          _.set(refundParams, "amount", _.get(input, "value.refund"));
        }
        else {
          let upcomingInvoice = await this.fetchUpcomingInvoice({
            preview_cancellation_refund: true,
            customer: _.get(this, "data.id"),
            subscription: _.get(subscription, "data.id"),
            refund_value_from: _.get(input, "value.refund_value_from")
          });
          debug("Upcoming Invoice: ", upcomingInvoice.toJson());
          const refundData = upcomingInvoice.calculateProration(_.get(input, "value.refund_value_from"));
          debug("Refund data: ", refundData);
          const prorationCost = _.get(refundData, "proration_cost");
          if (Math.sign(prorationCost) === -1 || Math.sign(prorationCost) === -0) {
            _.set(refundParams, "amount", Math.abs(prorationCost));
          }
        }
      }
      debug("Refund params: ", refundParams);
      debug("Input params: ", input.value);
      await subscription.cancel(atPeriodEnd);
      _.set(response, "subscription", subscription.toJson());
      _.set(response, "refund", null);
      if (!atPeriodEnd && (_.has(input, "value.refund") || _.has(input, "value.refund_value_from"))) {
        debug("See this only with refund params.");
        const refund = await this.refund(refundParams);
        _.set(response, "refund", refund.toJson());
      }
      return Promise.resolve(response);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async changeSubscription (args) {
    try {
      await this.selfPopulate();
      if (this._stush.fetchModel() === "multiple" && !_.has(args, "subscription")) {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Subscription is required in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      const subscription = await this.fetchSubscription(_.get(args, "subscription", null));
      await subscription.change(args);
      return Promise.resolve(subscription);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async newChangeSubscription (toSubscription, fromSubscription = null) {
    try {
      await this.selfPopulate();
      if (this._stush.fetchModel() === "multiple" && !fromSubscription) {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Subscription is required in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      if (!fromSubscription) {
        fromSubscription = await this.fetchSubscription();
      }
      let subscription = fromSubscription.clone();
      await subscription.change(toSubscription);
      return Promise.resolve(subscription);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async backuppreviewProration (args = null) {
    try {
      await this.selfPopulate();
      if (this._stush.fetchModel() === "multiple" && !args) {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Subscription is required in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      const subscription = await this.fetchSubscription(_.get(args, "subscription", null));
      _.set(args, "subscription", subscription);
      let input = previewProrationValidator(args);
      const upcomingInvoice = await this.fetchUpcomingInvoice(input.value);
      // Check if there is a change in billing period.
      const planToChange = new Plan(this._stush, {
        id: _.get(input, "value.plan_to_change")
      });
      await planToChange.selfPopulate();
      const newPlan = new Plan(this._stush, {
        id: _.get(args, "plan")
      });
      await newPlan.selfPopulate();
      const changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval();
      const prorationData = upcomingInvoice.calculateProration(_.get(args, "prorate_from"), changeInBillingCycle);
      _.set(prorationData, "upcoming_invoice", upcomingInvoice);
      return Promise.resolve(prorationData);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async previewProration (toSubscription, fromSubscription = null) {
    try {
      await this.selfPopulate();
      if (this._stush.fetchModel() === "multiple" && !fromSubscription) {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Subscription is required in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      if (!fromSubscription) {
        fromSubscription = await this.fetchSubscription();
      }
      let params = {},
        subscriptionItem = fromSubscription.fetchSubscriptionItem();
      _.set(params, "value.items", _.get(toSubscription, "data.items"));
      if (!_.has(toSubscription, "data.items") || !_.isArray(_.get(toSubscription, "data.items"))) {
        _.set(params, "value.plan_to_change", _.get(subscriptionItem, "plan.id"));
        _.set(params, "value.items", [{
          id: subscriptionItem.id,
          plan: _.get(toSubscription, "data.items[0].plan", _.get(toSubscription, "data.items.data[0].plan.id"))
        }]);
      }
      if (_.get(toSubscription, "data.cancellation_proration")) {
        _.set(params, "value.preview_cancellation_refund", true);
      }
      else {
        _.set(params, "value.preview_proration", true);
      }
      _.unset(params, "value.cancellation_proration");
      // debug("Upcoming invoice params: ", params); process.exit();
      const upcomingInvoice = await this.fetchUpcomingInvoice(params.value);
      // Check if there is a change in billing period.
      const planToChange = new Plan(this._stush, {
        id: _.get(params, "value.plan_to_change")
      });
      await planToChange.selfPopulate();
      const newPlan = new Plan(this._stush, {
        id: _.get(args, "plan")
      });
      await newPlan.selfPopulate();
      const changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval();
      const prorationData = upcomingInvoice.calculateProration(_.get(args, "prorate_from"), changeInBillingCycle);
      _.set(prorationData, "upcoming_invoice", upcomingInvoice);
      return Promise.resolve(prorationData);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async refund (args) {
    try {
      const refund = await this._stush.stripe.refunds.create(args);
      return Promise.resolve(new Refund(this._stush, refund));
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async fetchAllInvoices (args = {}) {
    try {
      _.assignIn(args, {
        customer: this.data.id
      });
      let invoices = await Invoice.fetchAll(this._stush, args);
      return Promise.resolve(invoices);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async fetchUpcomingInvoice (args) {
    try {
      if (!this.data.id) {
        return Promise.reject(generateError("Please provide a valid customer ID to add a new subscription."));
      }
      let subscription,
        subscriptionItems,
        invoice = new Invoice(this._stush),
        params = {
          customer: this.data.id
        };
      if (_.has(args, "preview_cancellation_refund") || _.has(args, "preview_proration")) {
        subscription = _.get(args, "subscription");
        if (typeof subscription === "string") {
          subscription = await this.fetchSubscription(_.get(args, "subscription"));
        }
        subscriptionItems = _.get(args, "items", []);
        if (!_.has(args, "items")) {
          subscriptionItems = [{
            id: subscription.data.items.data[0].id,
            plan: subscription.data.items.data[0].plan.id
          }];
        }
        _.set(params, "subscription_items", subscriptionItems);
        _.set(params, "subscription_proration_date", _.get(args, "refund_value_from", _.get(args, "prorate_from")));
        if (_.get(args, "preview_cancellation_refund", false)) {
          _.set(params, "subscription_items[0].quantity", 0);
        }
      }
      if (_.has(args, "subscription")) {
        if (typeof _.get(args, "subscription") === "string") {
          _.set(params, "subscription", _.get(args, "subscription"));
        }
        else {
          _.set(params, "subscription", _.get(args, "subscription.data.id"));
        }
      }
      // debug(params); process.exit();
      await invoice.populateWithUpcoming(params);
      return Promise.resolve(invoice);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async fetchAnInvoice (args = {}) {
    try {
      const params = {
        limit: 1,
        customer: this.data.id
      };
      _.assignIn(params, args);
      const invoice = await this._stush.stripe.invoices.list(params);
      return Promise.resolve(new Invoice(this._stush, _.head(invoice.data)));
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async fetchLatestPlan(subscriptionId = null) {
    const subscription = await this.fetchSubscription(subscriptionId),
      planId = subscription.fetchLatestPlan();
    let plan = new Plan(this._stush, {
      id: planId
    });
    await plan.selfPopulate();
    return plan;
  }
}
