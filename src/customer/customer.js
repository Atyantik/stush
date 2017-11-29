/**
 * Created by ravindra on 21/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import CustomerSchema, { validator as CustomerSchemaValidator, cancelSubscriptionValidator } from "./schema";
import Source from "../source/source";
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

  // customer.set({
  //  name: "Tirth",
  //  Surname: "Bodawala"
  // })

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

  async detachSource (sourceId) {
    try {
      const source = await this._stripe.customers.deleteSource(this.data.id, {
        source: sourceId
      });
      return Promise.resolve(new Source(this._stush, source));
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  isSubscribed() {
    return _.get(this.data, "subscriptions.data.length", 0) !== 0;
  }

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

  extractAllSubscriptions () {
    const subscriptions = _.get(this.data, "subscriptions.data");
    let set = new Set();
    for (let subscription of subscriptions) {
      set.add(new Subscription(this._stush, subscription));
    }
    return set;
  }

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

  async endSubscription(args) {
    try {
      let input = cancelSubscriptionValidator(args);
      debug("Input: ", input);
      // let subscription = new Subscription(this, {id: _.get(input, "value.subscription")});
      let subscription = _.has(input, "value.subscription") ? this.extractSubscription(input.value.subscription) : this.extractSubscription();
      debug("Extracted subscription: ", subscription);
      if (_.has(input, "value.refund") || _.has(input, "value.refund_value_from")) {
        // await subscription.selfPopulate();  // Need this in case of proration
        //
      }
      await subscription.cancel(input.value.cancel === "after_billing_cycle");
      return Promise.resolve(subscription);
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
      let invoices = await Invoice.fetchAllInvoices(this._stush, args);
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
}
