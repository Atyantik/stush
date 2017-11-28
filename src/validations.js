/**
 * Created by ravindra on 20/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "./handler/error";

const stushOptionsSchema = Joi.object().keys({
  secret: Joi.string().token().required(),
  subscription_model: Joi.string().valid("single", "multiple"),
  enable_proration: Joi.string().valid("all", "none", "change_subscription", "cancel_subscription"),
  charge_instantly: Joi.boolean()
});

const createPlanSchema = Joi.object().keys({
  id: Joi.string().required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().length(3, "utf8").required(),
  bill_every: Joi.string().required(),
  name: Joi.string().required(),
  metadata: Joi.object(),
  statement_descriptor: Joi.string()
});

const createSubscriptionSchema = Joi.object().keys({
  customer: Joi.alternatives([Joi.object(), Joi.string().token()]).required(),
  subscription: Joi.object().keys({
    application_fee_percent: Joi.number().positive().precision(2),
    billing: Joi.string().valid("charge_automatically", "send_invoice").default("charge_automatically"),
    coupon: Joi.string(),
    days_until_due: Joi.alternatives().when("billing", {is: "send_invoice", then: Joi.number().min(1).required(), otherwise: Joi.strip()}),
    plan: Joi.string().required(),
    plan_quantity: Joi.number().positive(),
    source: Joi.string().token(),
    tax_percent: Joi.number().positive().precision(2),
    trial_ends: Joi.number().positive(),
    trial_days: Joi.number().min(0)
  }).without("trial_ends", "trial_days")
    .required()
}).required();

const cancelSubscriptionSchema = Joi.object().keys({
  customer: Joi.string().token().when("refund_value_from", {is: Joi.exist(), then: Joi.required()}),
  subscription: Joi.string().token().when("customer", {is: !Joi.exist(), then: Joi.required()}),
  cancel: Joi.string().valid("now", "after_billing_cycle").default("now"),
  refund: Joi.number().positive(),
  refund_value_from: Joi.number().positive().when("refund", {is: Joi.exist(), then: Joi.strip()}),
});

const previewCancelationRefundSchema = Joi.object().keys({
  customer: Joi.string().token().required(),
  subscription: Joi.string().token().required(),
  refund_value_from: Joi.number().positive().required()
});

export default class Validator {
  validateStushOptions(options) {
    let result = Joi.validate(options, stushOptionsSchema);
    // debug(result); process.exit();
    if (result.error) {
      throw generateError(result.error.details);
    }
  }

  createPlanInput(args) {
    let result = Joi.validate(args, createPlanSchema);
    if (result.error) {
      throw result.error;
    }
    // const daily = ["day", "days", "daily", "everyday", "day-to-day"],
    //   weekly = ["week", "weeks", "weekly"],
    //   monthly = ["month", "months", "monthly"],
    //   yearly = ["year", "yearly"];
    // _.set(args, "amount", _.get(args, "price"));
    // let interval = _.get(args, "bill_every");
    // const intervalArr = _.split(_.get(args, "bill_every"), " ", 2);
    // if (intervalArr.length > 1) {
    //   Joi.attempt(_.head(intervalArr), Joi.number()); // throws if fails
    //   _.set(args, "interval_count", _.head(intervalArr));
    //   interval = _.tail(intervalArr);
    // }
    return result;
  }

  createSubscriptionInput(args) {
    let result = Joi.validate(args, createSubscriptionSchema, {allowUnknown: true});
    if (_.has(args, "customer")) {
      if (typeof args.customer === "string") {
        _.set(args, "customer", {id: args.customer});
      }
      else {
        let stripeCustomerKeys = [
          "email",
          "source",
          "default_source",
          "account_balance",
          "business_vat_id",
          "coupon",
          "description",
          "metadata",
        ];
        let metadata = _.pick(args.customer, _.keys(_.omit(args.customer, stripeCustomerKeys)));
        _.set(args, "customer.metadata", {});
        _.assignIn(_.get(args, "customer.metadata"), metadata);
        _.set(args, "customer", deleteProperties(args.customer, _.keys(_.omit(args.customer, stripeCustomerKeys))));
      }
    }
    if (_.get(args, "subscription.trial_days", 0) > 0) {
      _.set(args, "subscription.trial_period_days", _.get(args, "subscription.trial_days"));
    }
    _.unset(args, "subscription.trial_days");
    _.set(args, "subscription.items", []);
    args.subscription.items.push({
      plan: _.get(args, "subscription.plan"),
      quantity: _.get(args, "subscription.plan_quantity", 1)
    });
    _.set(result, "params", _.omit(args, [
      "customer.user_id",
      "customer.full_name",
      "customer.phone",
      "subscription.plan",
      "subscription.plan_quantity",
      "value"
    ]));

    return result;
  }

  cancelSubscriptionInput(args) {
    let result = Joi.validate(args, cancelSubscriptionSchema);
    if (result.error) {
      throw result.error;
    }
    return result;
  }

  previewCancelationRefundInput(args) {
    let result = Joi.validate(args, previewCancelationRefundSchema);
    if (result.error) {
      throw result.error;
    }
    return result;
  }
}

module.exports = Validator;