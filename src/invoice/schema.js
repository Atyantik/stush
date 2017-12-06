/**
 * Created by ravindra on 27/11/17.
 */
import Joi from "joi";
import _ from "lodash";

const schema = Joi.object().keys({
  application_fee: Joi.number().positive().allow(null),
  closed: Joi.boolean(),
  description: Joi.string().allow(null),
  forgiven: Joi.boolean(),
  metadata: Joi.object().allow(null),
  paid: Joi.boolean(),
  statement_descriptor: Joi.string().allow(null),
  tax_percent: Joi.number().min(0).precision(2).allow(null)
});

export const validator = (input, allowImmutable = false) => {
  let options = {};
  if (allowImmutable) {
    _.set(options, "allowUnknown", true);
  }
  let output = Joi.validate(input, schema, options);
  if (output.error) {
    throw output.error;
  }
  if (!allowImmutable) {
    let mutableFields = [
      "application_fee",
      "closed",
      "description",
      "forgiven",
      "metadata",
      "paid",
      "statement_descriptor",
      "tax_percent"
    ];
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export const sanitizePopulateWithUpcoming = args => {
  let omit = [], params = {};
  if (_.has(args, "customer")) {
    omit.push("customer");
  }
  if (_.has(args, "subscription")) {
    omit.push("subscription");
  }
  _.assignIn(params, _.omit(args, omit));
  return params;
};

export default schema;