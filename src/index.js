import Stripe from "stripe";
import _ from "lodash";
import memCache from "memory-cache";
import Validator from "validations";
import Plan from "./plan/plan";
import Invoice from "./invoice/invoice";
import Customer from "./customer/customer";
import Subscription from "./subscription/subscription";
import generateError from "./handler/error";
import { makeUtilsGlobal } from "./utils";

makeUtilsGlobal();

class Stush {
  userOptions = {
    subscription_model: "multiple",
    proration: "change_subscription",
    charge_instantly: false,
    cache: new memCache.Cache(),
    cache_plans: 24*3600
  };
  stripe = {};

  constructor (options) {
    this.validator = new Validator();
    this.validator.validateStushOptions(options);
    _.assignIn(this.userOptions, options);
    this.stripe = new Stripe(_.get(this.userOptions, "secret"));
  }

  fetchWebhookSecret() {
    return _.get(this, "userOptions.webhook_secret");
  }

  fetchModel() {
    return _.get(this, "userOptions.subscription_model");
  }

  fetchProrationSetting() {
    return _.get(this, "userOptions.proration");
  }

  chargesInstantly() {
    return _.get(this, "userOptions.charge_instantly");
  }

  fetchCacheInstance() {
    return _.get(this, "userOptions.cache");
  }

  fetchCacheLifetime() {
    return _.get(this, "userOptions.cache_plans");
  }

  async createPlan (args) {
    try {
      let input = this.validator.createPlanInput(args);
      let plan = new Plan(this, input.value);
      await plan.save();
      return Promise.resolve(plan);
    }
    catch (err) {
      if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  async deletePlan (planId) {
    try {
      let plan = new Plan(this, {id: planId});
      await plan.delete();
      return Promise.resolve(plan);
    }
    catch (err) {
      if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  async fetchAllPlans (args) {
    try {
      const plans = await Plan.fetchAll(this, args);
      return Promise.resolve(plans);
    }
    catch (err) {
      if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  async createCustomer (customerData) {
    try {
      let customer = new Customer(this, customerData);
      await customer.save();
      return Promise.resolve(customer);
    }
    catch (err) {
      if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

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
        if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
          return Promise.reject(generateError(err.details));
        }
        return Promise.reject(generateError(null, err));
      }
    }
    else {
      return Promise.reject(generateError(input.error.details));
    }
  }

  async cancelSubscription (args) {
    try {
      let input = this.validator.cancelSubscriptionInput(args);
      if (_.has(args, "customer")) {
        if (this.fetchModel() === "single") {
          //
        }
      }
      let subscription = new Subscription(this, {id: _.get(input, "value.subscription")});
      if (_.has(input, "value.refund") || _.has(input, "value.refund_value_from")) {
        // await subscription.selfPopulate();  // Need this in case of proration
        //
      }
      await subscription.cancel(input.value.cancel === "after_billing_cycle");
      return Promise.resolve(subscription);
    }
    catch (err) {
      if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  async verifyHook(body, sig) {
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

export default Stush;
module.exports = {
  Stush: Stush,
  Plan: Plan,
  Invoice: Invoice,
  Customer: Customer,
  Subscription: Subscription
};