import Stripe from "stripe";
import _ from "lodash";
import memCache from "memory-cache";
import Validator from "validations";
import Plan from "./plan/plan";
import Coupon from "./coupon/coupon";
import Invoice from "./invoice/invoice";
import Customer from "./customer/customer";
import Subscription from "./subscription/subscription";
import generateError from "./handler/error";
import { makeUtilsGlobal } from "./utils";
import BetterQueue from "at-better-queue";
import Worker from "./hook/worker";
import EventEmitter from "events";

makeUtilsGlobal();

class Stush {
  userOptions = {
    subscription_model: "multiple",
    proration: "change_subscription",
    charge_instantly: false,
    worker_instances: 1,
    cache: new memCache.Cache(),
    cache_plans: 24*3600
  };
  stripe = {};
  _queue = new BetterQueue((task, cb) => {
    Worker.process(task, cb);
  }, {
    concurrent: _.get(this, "userOptions.worker_instances", 1)
  });
  _emitter = new EventEmitter();

  constructor (options) {
    this.validator = new Validator();
    this.validator.validateStushOptions(options);
    _.assignIn(this.userOptions, options);
    this.stripe = new Stripe(_.get(this.userOptions, "secret"));
  }

  /**
   * Fetches webhook secret key for the Stush instance.
   */
  fetchWebhookSecret() {
    return _.get(this, "userOptions.webhook_secret", null);
  }

  /**
   * Fetches subscription model type for the Stush instance.
   */
  fetchModel() {
    return _.get(this, "userOptions.subscription_model");
  }

  /**
   * Fetches proration setting for the Stush instance.
   */
  fetchProrationSetting() {
    return _.get(this, "userOptions.proration");
  }

  /**
   * Fetches "charge_instantly" setting for the Stush instance.
   */
  chargesInstantly() {
    return _.get(this, "userOptions.charge_instantly");
  }

  /**
   * Fetches cache instance for the Stush instance.
   */
  fetchCacheInstance() {
    return _.get(this, "userOptions.cache");
  }

  /**
   * Fetches cache lifetime setting for the Stush instance.
   */
  fetchCacheLifetime() {
    return _.get(this, "userOptions.cache_plans");
  }

  /**
   * Creates a new plan.
   * @param args
   * @returns {Promise.<*>}
   */
  async createPlan (args) {
    try {
      let input = this.validator.createPlanInput(args);
      let plan = new Plan(this, input.value);
      await plan.save();
      return Promise.resolve(plan);
    }
    catch (err) {
      if (_.get(err, "isJoi", null)) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  /**
   * Deletes a plan.
   * @param planId
   * @returns {Promise.<*>}
   */
  async deletePlan (planId) {
    try {
      let plan = new Plan(this, {id: planId});
      await plan.delete();
      return Promise.resolve(plan);
    }
    catch (err) {
      if (_.get(err, "isJoi", null)) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  /**
   * Fetches all plans.
   * @param args
   * @returns {Promise.<*>}
   */
  async fetchAllPlans (args) {
    try {
      const plans = await Plan.fetchAll(this, args);
      return Promise.resolve(plans);
    }
    catch (err) {
      if (_.get(err, "isJoi", null)) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  /**
   * Creates a new customer.
   * @param customerData
   * @returns {Promise.<*>}
   */
  async createCustomer (customerData) {
    try {
      let customer = new Customer(this, customerData);
      await customer.save();
      return Promise.resolve(customer);
    }
    catch (err) {
      if (_.get(err, "isJoi", null)) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  /**
   * Fetches a customer.
   * @param customerId
   * @returns {Promise.<*>}
   */
  async getCustomer (customerId) {
    try {
      let customer = new Customer(this, {id: customerId});
      await customer.selfPopulate();
      return Promise.resolve(customer);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Deletes a customer.
   * @param customerId
   * @returns {Promise.<*>}
   */
  async deleteCustomer (customerId) {
    try {
      const customer = new Customer(this, {id: customerId});
      await customer.delete();
      return Promise.resolve(customer);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Creates a new subscription (and customer, based on the arguments).
   * @param args
   * @returns {Promise.<*>}
   */
  async createSubscription (args) {
    let input = this.validator.createSubscriptionInput(args);
    // debug("Vanguard validation: ", input.value);process.exit();
    if (!input.error) {
      try {
        let subscription = new Subscription(this, _.get(input, "value.subscription")),
          customer = new Customer(this, _.get(input, "value.customer"));
        if (_.has(input, "value.customer.id")) {
          // Create subscription for provided customer.
          // Sync local instance with stripe instance of customer.
          await customer.selfPopulate();
          if (this.fetchModel() === "single") {
            if (customer.isSubscribed()) {
              return Promise.reject(generateError("Only one subscription is allowed per user in \"single subscription model\""));
            }
          }
          subscription = await customer.addSubscription(subscription);
        }
        else {
          // Create new customer and a subscription.
          // Save local instance of customer to stripe.
          await customer.save();
          subscription = await customer.addSubscription(subscription);
        }
        const resolved = {
          data: {
            customer: customer,
            subscription: subscription
          },
          code: 200
        };
        return Promise.resolve(resolved);
      }
      catch (err) {
        if (_.get(err, "isJoi", null)) {
          return Promise.reject(generateError(err.details));
        }
        return Promise.reject(generateError(null, err));
      }
    }
    else {
      return Promise.reject(generateError(input.error.details));
    }
  }

  /**
   * Changes a susbcription (upgrades or downgrades).
   * @param toSubscription
   * @param fromSubscription
   * @returns {Promise.<*>}
   */
  async changeSubscription(toSubscription, fromSubscription) {
    if (!fromSubscription) {
      throw generateError("Subscription to change is required.");
    }
    try {
      if (!_.get(fromSubscription, "data.object", null)) {
        debug(fromSubscription); process.exit();
        await fromSubscription.selfPopulate();
      }
      const subscription = fromSubscription.clone();
      await subscription.change(toSubscription);
      return Promise.resolve(subscription);
    }
    catch (err) {
      if (_.get(err, "isJoi", null)) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  /**
   * Cancels a subscription.
   * @param subscription
   * @returns {Promise.<*>}
   */
  async cancelSubscription (subscription = null) {
    if (!subscription) {
      throw generateError("Subscription is required for cancellation.");
    }
    try {
      if (typeof subscription === "string") {
        const subObj = new Subscription(this, {
          id: subscription
        });
        await subObj.selfPopulate();
        subscription = subObj.clone();
      }
      const response = await subscription.cancel();
      return Promise.resolve(response);
    }
    catch (err) {
      if (_.get(err, "isJoi", null)) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  async validateCoupon(couponCode) {
    try {
      const coupons = Coupon.fetchAll(this);
      for (let value of coupons) {
        if (couponCode === _.get(value, "data.id")) {
          return Promise.resolve(value);
        }
      }
      return Promise.reject({
        isJoi: true,
        details: {
          message: "Invalid coupon code!",
          code: 404
        }
      });
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async processHook(rawBody, stripeSignature) {
    try {
      await this._validateRawBody(rawBody);
      const stripeEvent = await this._verifyHook(rawBody, stripeSignature);
      await this.addToQueue(stripeEvent);
      return Promise.resolve(stripeEvent);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async _validateRawBody(body) {
    try {
      const validJson = JSON.parse(body);
      return Promise.resolve(validJson);
    }
    catch (err) {
      return err;
    }
  }

  async addToQueue(stripeEvent) {
    try {
      const params = {
        stushInstance: this,
        stripeEvent: stripeEvent
      };
      this._queue.push(params);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async on(event, callback) {
    try {
      this._emitter.on(event, callback);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Verifies webhook from Stripe.
   * @param body
   * @param sig
   * @returns {Promise.<*>}
   */
  async _verifyHook(body, sig) {
    try {
      const secret = this.fetchWebhookSecret();
      let response = await this.stripe.webhooks.constructEvent(body, sig, secret);
      return Promise.resolve(response);
    }
    catch (err) {
      return Promise.reject(generateError(null, err));
    }
  }
}

// export default Stush;
module.exports = {
  Stush: Stush,
  Plan: Plan,
  Coupon: Coupon,
  Invoice: Invoice,
  Customer: Customer,
  Subscription: Subscription
};
