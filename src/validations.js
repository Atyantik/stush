/**
 * Created by ravindra on 20/11/17.
 */
import Joi from "joi";
import _ from "lodash";

export default class Validator {
  createSubscriptionInput(args) {
    const schema = Joi.object().keys({
      customer: Joi.object().keys({
        user_id: Joi.number().positive(),
        email: Joi.string().email().required(),
        full_name: Joi.string(),
        phone: Joi.string(),
        source: Joi.string().token(),
        default_source: Joi.string().token(),
        account_balance: Joi.number().positive(),
        business_vat_id: Joi.string(),
        coupon: Joi.string(),
        description: Joi.string()
      }),
      subscription: Joi.object().keys({
        customer: Joi.string().token(),
        application_fee_percent: Joi.number().positive().precision(2),
        billing: Joi.string().allow("charge_automatically", "send_invoice").default("charge_automatically"),
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

    let result = Joi.validate(args, schema);
    if (_.has(args, "customer")) {
      _.set(args, "customer.metadata", {
        user_id: _.get(args, "customer.user_id", null),
        full_name: _.get(args, "customer.full_name", null),
        phone: _.get(args, "customer.phone", null)
      });
    }
    if (_.get(args, "subscription.trial_days", 0) > 0) {
      _.set(args, "subscription.trial_period_days", _.get(args, "subscription.trial_days"));
    }
    _.unset(args, "subscription.trial_days");
    _.set(args, "subscription.items", [{
      plan: _.get(args, "subscription.plan"),
      quantity: _.get(args, "subscription.plan_quantity", 1)
    }]);
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
}

module.exports = Validator;