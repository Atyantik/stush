/**
 * Created by ravindra on 21/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import CustomerSchema, { validator as CustomerSchemaValidator } from "./schema";
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

  isSubscribed() {
    return _.get(this.data, "subscriptions.data.length", 0) !== 0;
  }

  extractSubscription(subscriptionId = null) {
    const subscriptions = _.get(this.data, "subscriptions");
    let requiredSubscription = null;
    if (subscriptionId) {
      for (let value of subscriptions.data) {
        if (subscriptionId === value.id) {
          requiredSubscription = value;
          break;
        }
      }
    }
    return requiredSubscription ? requiredSubscription : _.get(this.data, "subscriptions.data.[0]");
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

  async fetchUpcomingInvoice (args) {
    try {
      if (!this.data.id) {
        return Promise.reject(generateError("Please provide a valid customer ID to add a new subscription."));
      }
      let invoice = new Invoice(this._stush),
        subscription = new Subscription(this._stush), params = {customer: this.data.id};
      if (_.has(args, "preview_cancellation_refund") || _.has(args, "preview_proration")) {
        subscription.set(this.extractSubscription(_.get(args, "subscription")), true);
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
