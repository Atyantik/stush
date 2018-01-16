/**
 * Created by ravindra on 22/11/17.
 */
import _ from "lodash";
import SubscriptionSchema, {validator as SubscriptionSchemaValidator, formatSubscriptionData, stripConfigOptions} from "./schema";
import CustomerSchema, { cancelSubscriptionValidator } from "../customer/schema";
import generateError from "../handler/error";
import Plan from "../plan/plan";
import Invoice from "../invoice/invoice";
import Customer from "../customer/customer";

export default class Subscription {
  data = {};
  _stush = {};

  constructor(stushInstance, subscriptionData) {
    this._stush = stushInstance;
    this.set(subscriptionData);
  }

  /**
   * Fetches all subscriptions.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */
  static async fetchAll (stushInstance, args = {}) {
    try {
      const subscriptions = await stushInstance.stripe.subscriptions.list(args);
      let set = [];
      for (let subscription of subscriptions.data) {
        set.push(new Invoice(stushInstance, subscription));
      }
      return Promise.resolve(set);
    }
    catch (err) {
      return Promise.reject(generateError(err));
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
    updatedData = formatSubscriptionData(updatedData);
    SubscriptionSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  /**
   * Creates a new subscription if ID not present; otherwise, updates the subscription.
   * @returns {Promise.<*>}
   */
  async save() {
    try {
      let data = {};
      stripConfigOptions(this.data);
      if (_.has(this.data, "id")) {
        let params = SubscriptionSchemaValidator(this.data);
        data = await this._stush.stripe.subscriptions.update(this.data.id, params.value);
      }
      else {
        data = await this._stush.stripe.subscriptions.create(this.data);
      }
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Populates the local subscription from Stripe.
   * @returns {Promise.<*>}
   */
  async selfPopulate() {
    if (!this.data.id) {
      return Promise.reject(generateError("Please provide a valid subscription ID before self populating."));
    }
    try {
      const stripeSubscription = await this._stush.stripe.subscriptions.retrieve(this.data.id);
      _.assignIn(this.data, stripeSubscription);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Creates a clone of the subscription instance.
   * @returns {Subscription}
   */
  clone() {
    return new Subscription(this._stush, _.cloneDeep(this.data));
  }

  /**
   * Returns data in JSON format.
   */
  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  /**
   * Fetches a subscription item.
   * @param planId
   * @returns {*}
   */
  fetchSubscriptionItem(planId = null) {
    const subscriptionItems = _.get(this.data, "items.data");
    let requiredSubscriptionItem;
    if (planId) {
      for (let value of subscriptionItems) {
        if (planId === value.plan.id) {
          requiredSubscriptionItem = value;
          break;
        }
      }
      if (!requiredSubscriptionItem) {
        throw generateError("Specified customer is not subscribed to subscription with provided plan.");
      }
    }
    else {
      requiredSubscriptionItem = _.get(this.data, "items.data.[0]", {});
    }
    return requiredSubscriptionItem;
  }

  /**
   * Fetches the latest subscribed or modified plan.
   * @returns {Promise.<T>}
   */
  fetchLatestPlan() {
    const subscriptionItems = _.get(this.data, "items.data");
    for (let value of subscriptionItems) {
      if (_.has(value, "plan")) {
        return Promise.resolve(_.get(value, "plan.id"));
      }
    }
  }

  /**
   * Changes the subscription(upgrades or downgrades).
   * @param subscription
   * @returns {Promise.<*>}
   */
  async change(subscription) {
    if (!subscription) {
      throw generateError("Subscription to change to is required.");
    }
    try {
      let params = {},
        subscriptionItem = this.fetchSubscriptionItem();
      _.set(params, "items", _.get(subscription, "data.items"));
      _.set(params, "items[0].id", _.get(subscriptionItem, "id"));
      if (_.has(subscription, "data.tax_percent")) {
        _.set(params, "tax_percent", _.get(subscription, "data.tax_percent", ""));
      }
      if (_.has(subscription, "data.metadata")) {
        _.set(params, "metadata", _.get(subscription, "data.metadata", ""));
      }
      if (_.has(subscription, "data.coupon")) {
        _.set(params, "coupon", _.get(subscription, "data.coupon", ""));
      }
      if (_.has(subscription, "data.billing")) {
        _.set(params, "billing", _.get(subscription, "data.billing", "charge_automatically"));
      }
      if (_.has(subscription, "data.source")) {
        _.set(params, "source", _.get(subscription, "data.source", ""));
      }
      if (_.has(subscription, "data.days_until_due")) {
        _.set(params, "days_until_due", _.get(subscription, "data.days_until_due", 30));
      }
      const prorationEnabled = this._stush.fetchProrationSetting();
      if (prorationEnabled === "all" || prorationEnabled === "change_subscription") {
        _.set(params, "proration_date", _.get(subscription, "data.prorate_from", _.ceil(new Date()/1000)));
      }
      else {
        if (_.has(subscription, "data.prorate_from")) {
          return Promise.reject("Proration is disabled in configuration options.");
        }
        _.set(params, "prorate", false);
      }
      // Check if there is a change in billing period.
      const planToChange = new Plan(this._stush, {
        id: _.get(this, "data.items.data[0].plan.id")
      });
      await planToChange.selfPopulate();
      const newPlan = new Plan(this._stush, {
        id: _.get(subscription, "data.items[0].plan", _.get(subscription, "data.items.data[0].plan.id"))
      });
      await newPlan.selfPopulate();
      const changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval(),
        freeToPaid = _.get(planToChange, "data.amount") === 0,
        upgradingPlan = _.get(newPlan, "data.amount") > _.get(planToChange, "data.amount"),
        chargeInstantly = this._stush.chargesInstantly();
      // Update the subscription.
      this.data = await this._stush.stripe.subscriptions.update(this.data.id, params);
      if (!changeInBillingCycle && !freeToPaid && upgradingPlan && chargeInstantly) {
        // Create an invoice to initiate payment collection instantly.
        let invoice = new Invoice(this._stush, {
          customer: _.get(this, "data.customer"),
          subscription: _.get(this, "data.id")
        });
        await invoice.save();
      }
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Cancels the subscription.
   * @returns {Promise.<*>}
   */
  async cancel() {
    if (!_.has(this, "data.id")) {
      throw generateError("Please populate the Subscription instance before attempting to cancel it.");
    }
    try {
      let response = {},
        refundParams = {},
        input = cancelSubscriptionValidator(_.get(this, "data", {}));
      const atPeriodEnd = input.value.cancel === "after_billing_cycle";
      if (!_.has(this, "data.customer")) {
        await this.selfPopulate();
      }
      let customer = new Customer(this._stush, {
        id: _.get(this, "data.customer")
      });
      await customer.selfPopulate();
      // Check input with stush configuration options.
      const prorationEnabled = this._stush.fetchProrationSetting();
      if (prorationEnabled && !atPeriodEnd && (_.has(input, "value.refund") || _.has(input, "value.refund_value_from"))) {
        // Fetch last invoice on this subscription for charge ID
        const invoice = await customer.fetchAnInvoice({
          subscription: this.data.id
        });
        _.set(refundParams, "charge", _.get(invoice, "data.charge"));
        if (_.has(input, "value.refund")) {
          _.set(refundParams, "amount", _.get(input, "value.refund"));
        }
        else {
          let upcomingInvoice = await customer.fetchUpcomingInvoice({
            preview_cancellation_refund: true,
            customer: _.get(this, "data.id"),
            subscription: _.get(this, "data.id"),
            refund_value_from: _.get(input, "value.refund_value_from")
          });
          const refundData = upcomingInvoice.calculateProration(_.get(input, "value.refund_value_from"));
          const prorationCost = _.get(refundData, "proration_cost");
          if (Math.sign(prorationCost) === -1 || Math.sign(prorationCost) === -0) {
            _.set(refundParams, "amount", Math.abs(prorationCost));
          }
        }
      }

      let params = {};
      if (atPeriodEnd) {
        _.set(params, "at_period_end", true);
      }
      this.data = await this._stush.stripe.subscriptions.del(this.data.id, params);

      _.set(response, "subscription", this.toJson());
      _.set(response, "refund", null);
      if (!atPeriodEnd && (_.has(input, "value.refund") || _.has(input, "value.refund_value_from"))) {
        const refund = await customer.refund(refundParams);
        _.set(response, "refund", refund.toJson());
      }
      return Promise.resolve(response);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }
}

module.exports = Subscription;