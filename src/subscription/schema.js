/**
 * Created by ravindra on 23/11/17.
 */
import Joi from "joi";
import _ from "lodash";

const schema = Joi.object().keys({
  customer: Joi.string().token(),
  application_fee_percent: Joi.number().positive().precision(2).allow(null),
  billing: Joi.string().valid("charge_automatically", "send_invoice").default("charge_automatically"),
  coupon: Joi.string(),
  days_until_due: Joi.when("billing", {is: "send_invoice", then: Joi.number().min(1).required(), otherwise: Joi.number().strip()}),
  items: Joi.alternatives([Joi.array().items(Joi.object().keys({
    id: Joi.string().token(),
    deleted: Joi.boolean(),
    metadata: Joi.object(),
    plan: Joi.string().required(),
    quantity: Joi.number().min(0)
  })), Joi.object()]),
  metadata: Joi.object(),
  prorate: Joi.boolean(),
  proration_date: Joi.number().positive(),
  source: Joi.string().token(),
  tax_percent: Joi.number().positive().precision(2).allow(null),
  trial_ends: Joi.number().positive(),
  trial_period_days: Joi.number().positive(),   // Only during creation of subscription.
});

export const validator = (input, allowImmutable = false) => {
  let output = Joi.validate(input, schema, {allowUnknown: true});
  if (output.error) {
    throw output.error;
  }
  if (!allowImmutable) {
    let mutableFields = [
      "application_fee_percent",
      "billing",
      "coupon",
      "days_until_due",
      "items",
      "source",
      "metadata",
      "prorate",
      "proration_date",
      "tax_percent",
      "trial_ends"
    ];
    if (!_.has(input, "id")) {
      mutableFields.push("trial_period_days");
    }
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export default schema;