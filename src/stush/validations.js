/**
 * Created by ravindra on 20/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "../handler/error";

const stushOptionsSchema = Joi.object().keys({
  secret: Joi.string().token().required(),
  webhook_secret: Joi.string().token(),
  subscription_model: Joi.string().valid("single", "multiple"),
  proration: Joi.string().valid("all", "none", "change_subscription", "cancel_subscription"),
  charge_instantly: Joi.boolean()
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

export default class Validator {
  validateStushOptions(options) {
    let result = Joi.validate(options, stushOptionsSchema);
    if (result.error) {
      throw generateError(result.error.details);
    }
  }
}

module.exports = Validator;