import Stripe from "stripe";
import _ from "lodash";
import Validator from "validations";
import Customer from "./customer/customer";
import Subscription from "./subscription/subscription";
import generateError from "./handler/error";
import { makeUtilsGlobal } from "./utils";

makeUtilsGlobal();

class Stush {
  userOptions = {
    subscription_model: "multiple",
    enable_proration: "change_subscription",
    charge_instantly: false
  };

  constructor (options) {
    this.validator = new Validator();
    this.validator.validateStushOptions(options);
    _.assignIn(this.userOptions, options);
    this.stripe = new Stripe(_.get(this.userOptions, "secret"));
  }

  async createPlan (args) {
    try {
      let input = this.validator.createPlanInput(args);
    }
    catch (err) {
      if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  async createSubscription (args) {
    let input = this.validator.createSubscriptionInput(args);
    if (!input.error) {
      try {
        let subscription = new Subscription(this, _.get(input, "params.subscription")), customer = new Customer(this, _.get(input, "params.customer"));
        if (_.has(input, "params.customer.id")) {
          // Create subscription for provided customer.
          // Sync local instance with stripe instance of customer.
          await customer.selfPopulate();
          if (this.userOptions.subscription_model === "single") {
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
        debug("Customer data: ", customer.toJson());
        debug("Subscription data: ", subscription.toJson());
        const resolved = {
          data: {
            customer: customer.toJson(),
            subscription: subscription.toJson()
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

  async previewProration (args) {
    //
  }

  async previewCancellationRefund (args) {
    try {
      this.validator.previewCancelationRefundInput(args);
      let customer = new Customer(this, {id: _.get(args, "customer")}),
        proration_date = _.get(args, "refund_value_from", null),
        response;
      await customer.selfPopulate();
      _.set(args, "preview_cancellation_refund", true);
      const invoice = await customer.fetchUpcomingInvoice(args);
      response = invoice.calculateProration(proration_date);
      _.set(response, "invoice", invoice.toJson());
      return Promise.resolve(response);
    }
    catch (err) {
      if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
        return Promise.reject(generateError(err.details));
      }
      return Promise.reject(generateError(null, err));
    }
  }

  async cancelSubscription (args) {
    try {
      let input = this.validator.cancelSubscriptionInput(args);
      // let invoices = await this.stripe.invoices.list({
      //   customer: "cus_BqPO4KIbVqmiqa",
      //   subscription: "sub_BqPQ8IwpKz1zBF",
      //   limit: 1
      // });
      // debug(input); process.exit();
      if (_.has(args, "customer")) {
        if (this.userOptions.subscription_model === "single") {
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

  tinkerZone(customerId) {
    let customer = new Customer(this.stripe);
    return customer.isSubscribed(customerId);
  }
}

export default Stush;
module.exports = Stush;