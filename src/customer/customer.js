/**
 * Created by ravindra on 21/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import CustomerSchema, { validator as CustomerSchemaValidator, formatCustomerData } from "./schema";
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

  /**
   * Fetches all customers.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */
  static async fetchAll (stushInstance, args = {}) {
    try {
      const customers = await stushInstance.stripe.customers.list(args);
      let set = [];
      for (let customer of customers.data) {
        set.push(new Customer(stushInstance, customer));
      }
      return Promise.resolve(set);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Setter method for data(Also formats and validates data being set).
   * @param data
   * @param allowImmutable
   */
  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    updatedData = formatCustomerData(updatedData);
    CustomerSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  /**
   * Returns data in JSON format.
   */
  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  /**
   * Creates a new Stripe customer if ID not present; otherwise, updates the customer.
   * @returns {Promise.<*>}
   */
  async save() {
    try {
      let data = {};
      if (_.has(this.data, "id")) {
        let params = CustomerSchemaValidator(this.data);
        data = await this._stush.stripe.customers.update(this.data.id, params.value);
      }
      else {
        data = await this._stush.stripe.customers.create(this.data);
      }
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Deletes the customer.
   * @returns {Promise.<*>}
   */
  async delete() {
    if (!this.data.id) {
      throw generateError("Valid customer ID is required to delete the customer");
    }
    try {
      this.data = await this._stush.stripe.customers.del(this.data.id);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Populates the local customer from Stripe.
   * @returns {Promise.<*>}
   */
  async selfPopulate() {
    if (!this.data.id) {
      return Promise.reject(generateError("Please provide a valid customer ID before self populating"));
    }
    try {
      const stripeCustomer = await this._stush.stripe.customers.retrieve(this.data.id);
      _.assignIn(this.data, stripeCustomer);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async fetchAllSources(args = {}) {
    if (!this.data.id){
      throw generateError("Please provide a valid customer ID to fetch sources.");
    }
    try {
      const sources = await this._stush.stripe.customers.listSources(this.data.id, args);
      // Creating an array of Source instances.
      let sourcesArray = [];
      for (let source of sources.data) {
        sourcesArray.push(new Source(this._stush, source));
      }
      return Promise.resolve(sourcesArray);
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

  async updateSource (sourceId, params = {}) {
    try {
      const sourceParams = {
        metadata: _.omit(params, ["owner"])
      };
      if (_.has(params, "owner")) {
        _.set(sourceParams, "owner", _.get(params, "owner", ""));
      }
      const source = await this._stush.stripe.sources.update(sourceId, sourceParams);
      return Promise.resolve(new Source(this._stush, source));
    }
    catch (err) {
      if (_.has(err, "raw") && _.startsWith(err.raw.message, "No such source")) {
        const sourceExcludes = [
          "address_city",
          "address_country",
          "address_line1",
          "address_line2",
          "address_state",
          "address_zip",
          "exp_month",
          "exp_year",
          "name"
        ];
        const sourceParams = {
          metadata: _.omit(params, sourceExcludes)
        };
        _.assignIn(sourceParams, _.pick(params, sourceExcludes));
        const source = await this._stush.stripe.customers.updateCard(this.data.id, sourceId, sourceParams);
        return Promise.resolve(new Source(this._stush, source));
      }
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

  async verifySource (sourceId, amounts = []) {
    if (!this.data.id){
      throw generateError("Please provide a valid customer ID to verify source.");
    }
    try {
      const source = await this._stush.stripe.customers.verifySource(
        this.data.id,
        sourceId,
        {amounts: amounts}
      );

      return Promise.resolve(new Source(this._stush, source));
    }
    catch (e) {
      return Promise.reject(e);
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
   * Fetches a subscription by plan ID for the customer.
   * @param planId
   * @returns {Promise.<*>}
   */
  async fetchSubscriptionByPlan(planId) {
    if (!planId) {
      throw generateError("Plan ID is required to fetch subscription by plan.");
    }
    try {
      if (!_.get(this, "data.object", null)) {
        await this.selfPopulate();
      }
      const subscriptions = _.get(this.data, "subscriptions");
      let requiredSubscription;
      for (let subscription of subscriptions.data) {
        const subscriptionItems = _.get(subscription, "items.data");
        for (let value of subscriptionItems) {
          if (planId === _.get(value, "plan.id")) {
            requiredSubscription = subscription;
            break;
          }
        }
        if (requiredSubscription) {
          break;
        }
      }
      if (!requiredSubscription) {
        throw generateError("Customer is not subscribed to subscription with specified plan.");
      }
      return Promise.resolve(new Subscription(this._stush, requiredSubscription));
    }
    catch (err) {
      return Promise.reject(err);
    }
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
      await this.selfPopulate();
      if (this._stush.fetchModel() === "single") {
        if (this.isSubscribed()) {
          return Promise.reject(generateError("Only one subscription is allowed per user in \"single subscription model\""));
        }
      }
      let subscription = subscriptionObj.clone();
      _.set(subscription, "data.customer", this.data.id);
      await subscription.save();
      // await this.selfPopulate();
      return Promise.resolve(subscription);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Cancels a subscription.
   * @param subscription
   * @returns {Promise.<*>}
   */
  async endSubscription(subscription = null) {
    try {
      if (!subscription && this._stush.fetchModel() === "multiple") {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Valid subscription is required in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      if (!subscription || !_.has(subscription, "data.id")) {
        await this.selfPopulate();
        const stripeSubscription = await this.fetchSubscription();
        _.assignIn(subscription.data, stripeSubscription.data);
      }
      const response = await subscription.cancel();
      return Promise.resolve(response);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Changes a subscription(upgrades or downgrades).
   * @param toSubscription
   * @param fromSubscription
   * @returns {Promise.<*>}
   */
  async changeSubscription (toSubscription, fromSubscription = null) {
    try {
      await this.selfPopulate();
      if (this._stush.fetchModel() === "multiple" && !fromSubscription) {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Valid subscription is required in Multiple Subscription Model.",
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

  /**
   * Previews cancellation or change of plan proration details.
   * @param toSubscription
   * @param fromSubscription
   * @returns {Promise.<*>}
   */
  async previewProration (toSubscription, fromSubscription = null) {
    if (!_.get(toSubscription, "data.cancellation_proration", false) && _.has(toSubscription, "data.id")) {
      throw generateError("Existing subscription cannot be passed to preview plan change proration.");
    }
    try {
      await this.selfPopulate();
      if (this._stush.fetchModel() === "multiple" && !_.has(fromSubscription, "data.id") && !_.get(toSubscription, "data.cancellation_proration", false)) {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Valid subscription is required in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      if (!fromSubscription) {
        if (_.get(toSubscription, "data.cancellation_proration", false)) {
          fromSubscription = toSubscription.clone();
        }
        else {
          fromSubscription = await this.fetchSubscription();
        }
      }
      if (_.has(fromSubscription, "data.id")) {
        await fromSubscription.selfPopulate();
      }
      let params = {},
        subscriptionItem = fromSubscription.fetchSubscriptionItem();
      _.set(params, "value.subscription", fromSubscription);
      _.set(params, "value.prorate_from", _.get(toSubscription, "data.prorate_from", _.ceil(new Date()/1000)));
      _.set(toSubscription, "data.items[0].id", _.get(subscriptionItem, "id"));
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
      const upcomingInvoice = await this.fetchUpcomingInvoice(params.value);

      // Check if there is a change in billing period.
      const planToChange = new Plan(this._stush, {
        id: _.get(subscriptionItem, "plan.id")
      });
      await planToChange.selfPopulate();
      const newPlan = new Plan(this._stush, {
        id: _.get(params, "value.items[0].plan")
      });
      await newPlan.selfPopulate();
      const changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval() ||
        (_.get(planToChange, "data.amount") === 0 && _.get(newPlan, "data.amount") !== 0);
      let prorationData = await upcomingInvoice.calculateProration(_.get(params, "value.prorate_from"), changeInBillingCycle);
      _.set(prorationData, "upcoming_invoice", upcomingInvoice.toJson());
      return Promise.resolve(prorationData);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Refunds on the specified charge.
   * @param args
   * @returns {Promise.<*>}
   */
  async refund (args) {
    try {
      const refund = await this._stush.stripe.refunds.create(args);
      return Promise.resolve(new Refund(this._stush, refund));
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Fetches all invoices for the customer.
   * @param args
   * @returns {Promise.<*>}
   */
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

  /**
   * Fetches upcoming invoice for the customer.
   * @param args
   * @returns {Promise.<*>}
   */
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
      await invoice.populateWithUpcoming(params);
      return Promise.resolve(invoice);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Fetches an invoice for the customer.
   * @param args
   * @returns {Promise.<*>}
   */
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

  /**
   * Fetches the latest subscribed or modified plan(This operation is performed on subscription).
   * @param subscriptionId
   * @returns {Promise.<Plan>}
   */
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
