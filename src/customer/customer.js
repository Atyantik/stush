/**
 * Created by ravindra on 21/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import CustomerSchema, { validator as CustomerSchemaValidator, cancelSubscriptionValidator } from "./schema";
import Source from "../source/source";
import Refund from "../refund/refund";
import Invoice from "../invoice/invoice";
import Subscription from "../subscription/subscription";

export default class Customer {
  data = {};
  _stush = {};
  _stripe = {};

  constructor(stushInstance, customerData) {
    this._stush= stushInstance;
    this._stripe = stushInstance.stripe;
    this.set(customerData, true);
  }

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
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
        data = await this._stripe.customers.update(this.data.id, params.value);
      }
      else {
        debug("Updating Customer with: ", this.data);
        data = await this._stripe.customers.create(this.data);
      }
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
      this.data = await this._stripe.customers.retrieve(this.data.id);
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
      const source = await this._stripe.customers.createSource(this.data.id, {
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
      const source = await this._stripe.customers.deleteSource(this.data.id, {
        source: sourceId
      });
      return Promise.resolve(new Source(this._stush, source));
    }
    catch (err) {
      if (_.has(err, "raw") && err.raw.param === "id" && _.startsWith(err.raw.message, "No such source")) {
        const source = await this._stripe.customers.deleteCard(this.data.id, sourceId);
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
   * @returns {Subscription}
   */
  extractSubscription(subscriptionId = null) {
    const subscriptions = _.get(this.data, "subscriptions");
    let requiredSubscription;
    if (subscriptionId) {
      for (let value of subscriptions.data) {
        if (subscriptionId === value.id) {
          requiredSubscription = value;
          break;
        }
      }
      if (!requiredSubscription) {
        throw generateError("Specified customer is not subscribed to subscription with provided ID.");
      }
    }
    else {
      requiredSubscription = _.get(this.data, "subscriptions.data.[0]", {});
    }
    return new Subscription(this._stush, requiredSubscription);
  }

  /**
   * Fetches all the subscriptions on local customer instance.
   * @returns {Set}
   */
  extractAllSubscriptions () {
    const subscriptions = _.get(this.data, "subscriptions.data");
    let set = new Set();
    for (let subscription of subscriptions) {
      set.add(new Subscription(this._stush, subscription));
    }
    return set;
  }

  /**
   * Adds a new subscription to customer.
   * @param subscription
   * @returns {Promise.<*>}
   */
  async addSubscription(subscription) {
    try {
      if (!this.data.id) {
        return Promise.reject(generateError("Please provide a valid customer ID to add a new subscription."));
      }
      _.set(subscription, "data.customer", this.data.id);
      await subscription.save();
      this.selfPopulate();
      return Promise.resolve(subscription);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   *
   * @param args
   * @returns {Promise.<*>}
   */
  async endSubscription(args = {}) {
    try {
      let response = {}, refundParams = {}, input = cancelSubscriptionValidator(args);
      const atPeriodEnd = input.value.cancel === "after_billing_cycle",
        subscriptionModel = _.get(this, "_stush.userOptions.subscription_model");
      if (subscriptionModel === "multiple" && !_.has(input, "value.subscription")) {
        return Promise.reject({
          isJoi: true,
          details: [{
            message: "Subscription ID needs to be specified in Multiple Subscription Model.",
            code: 500
          }]
        });
      }
      let subscription = _.has(input, "value.subscription") ? this.extractSubscription(input.value.subscription) : this.extractSubscription();
      // Check input with stush configuration options.
      if (!atPeriodEnd && (_.has(input, "value.refund") || _.has(input, "value.refund_value_from"))) {
        const prorationEnabled = _.get(this, "_stush.userOptions.enable_proration");
        if (prorationEnabled !== "all" && prorationEnabled !== "cancel_subscription") {
          return Promise.reject({
            isJoi: true,
            details: [{
              message: "Proration is disabled in configuration options.",
              code: 500
            }]
          });
        }
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
      await subscription.cancel(atPeriodEnd);
      _.set(response, "subscription", subscription.toJson());
      if (!atPeriodEnd && (_.has(input, "value.refund") || _.has(input, "value.refund_value_from"))) {
        const refund = await this.refund(refundParams);
        _.set(response, "refund", refund.toJson());
      }
      return Promise.resolve(response);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async refund (args) {
    try {
      const refund = await this._stripe.refunds.create(args);
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
        invoice = new Invoice(this._stush),
        params = {customer: this.data.id};
      // subscription = new Subscription(this._stush), params = {customer: this.data.id};
      if (_.has(args, "preview_cancellation_refund") || _.has(args, "preview_proration")) {
        // subscription.set(this.extractSubscription(_.get(args, "subscription")), true);
        subscription = this.extractSubscription(_.get(args, "subscription"));
        _.set(params, "subscription_items", [{
          id: subscription.data.items.data[0].id,
          plan: subscription.data.items.data[0].plan.id
        }]);
        _.set(params, "subscription_proration_date", _.get(args, "refund_value_from"));
        if (_.get(args, "preview_cancellation_refund", false)) {
          _.set(params, "subscription_items[0].quantity", 0);
        }
      }
      if (_.has(args, "subscription")) {
        _.set(params, "subscription", _.get(args, "subscription"));
      }
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
      const invoice = await this._stripe.invoices.list(params);
      return Promise.resolve(new Invoice(this._stush, _.head(invoice.data)));
    }
    catch (err) {
      return Promise.reject(err);
    }
  }
}
