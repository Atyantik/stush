/**
 * Created by ravindra on 20/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "./handler/error";

const stushOptionsSchema = Joi.object().keys({
  secret: Joi.string().token().required(),
  webhook_secret: Joi.string().token(),
  subscription_model: Joi.string().valid("single", "multiple"),
  proration: Joi.string().valid("all", "none", "change_subscription", "cancel_subscription"),
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
    tax_percent: Joi.number().min(0).precision(2),
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

export default class Validator {
  validateStushOptions(options) {
    let result = Joi.validate(options, stushOptionsSchema);
    if (result.error) {
      throw generateError(result.error.details);
    }
  }

  createPlanInput(args) {
    let result = Joi.validate(args, createPlanSchema, {allowUnknown: true});
    if (result.error) {
      throw result.error;
    }
    return result;
  }

  createSubscriptionInput(args) {
    let result = Joi.validate(args, createSubscriptionSchema, {allowUnknown: true});
    if (_.has(result, "value.customer")) {
      let customerInput = _.get(result, "value.customer");
      if (typeof customerInput === "string") {
        _.set(result, "value.customer", {id: customerInput});
      }
      else {
        const stripeCustomerKeys = [
          "email",
          "source",
          "default_source",
          "account_balance",
          "business_vat_id",
          "coupon",
          "description",
          "metadata",
        ];
        let metadata = _.pick(customerInput, _.keys(_.omit(customerInput, stripeCustomerKeys)));
        _.set(result, "value.customer.metadata", {});
        _.assignIn(_.get(result, "value.customer.metadata"), metadata);
        _.set(result, "value.customer", deleteProperties(_.get(result, "value.customer"), _.keys(_.omit(_.get(result, "value.customer"), stripeCustomerKeys))));
      }
    }
    return result;
  }

  cancelSubscriptionInput(args) {
    let result = Joi.validate(args, cancelSubscriptionSchema);
    if (result.error) {
      throw result.error;
    }
    return result;
  }
}

module.exports = Validator;