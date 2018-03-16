/**
 * Created by ravindra on 27/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "../handler/error";

const schema = Joi.object().keys({
  // Create properties
  customer: Joi.string().token(),
  billing: Joi.string().valid("charge_automatically", "send_invoice"),
  days_until_due: Joi.number().when("billing", {
    is: Joi.exist().valid("send_invoice"),
    then: Joi.number().positive().required(),
    otherwise: Joi.number().allow(null)
  }),
  due_date: Joi.number().when("billing", {
    is: Joi.exist().valid("send_invoice"),
    then: Joi.number().positive().required(),
    otherwise: Joi.number().allow(null)
  }),
  subscription: Joi.string().token().allow(null),
  // Update properties
  application_fee: Joi.number().positive().allow(null),
  closed: Joi.boolean(),
  description: Joi.string().allow(null),
  forgiven: Joi.boolean(),
  metadata: Joi.object().allow(null),
  paid: Joi.boolean(),
  statement_descriptor: Joi.string().allow(null),
  tax_percent: Joi.number().min(0).precision(2).allow(null),
  // Stripe Invoice Object properties
  id: Joi.string().token(),
  object: Joi.string().valid("invoice"),
  amount_due: Joi.number().positive().min(0),
  attempt_count: Joi.number().positive().min(0),
  attempted: Joi.boolean(),
  charge: Joi.string().token().allow(null),
  currency: Joi.string().length(3, "utf8").allow(null),
  date: Joi.number().positive(),
  discount: Joi.object().allow(null),
  ending_balance: Joi.number().allow(null),
  lines: Joi.object(),
  livemode: Joi.boolean(),
  next_payment_attempt: Joi.number().positive(),
  number: Joi.string().token(),
  period_end: Joi.number().positive(),
  period_start: Joi.number().positive(),
  receipt_number: Joi.string().allow(null),
  starting_balance: Joi.number().positive().min(0),
  subtotal: Joi.number().positive().min(0),
  tax: Joi.number().positive().min(0).allow(null),
  total: Joi.number().positive().min(0),
  webhooks_delivered_at: Joi.number().positive().allow(null)
});

const mutableFields = [
  "application_fee",
  "closed",
  "description",
  "forgiven",
  "metadata",
  "paid",
  "statement_descriptor",
  "tax_percent"
];

const createMutableFields = [
  "customer",
  "billing",
  "days_until_due",
  "due_date",
  "subscription",
];

export const validator = (input, allowImmutable = false) => {
  let options = {};
  if (allowImmutable) {
    _.set(options, "allowUnknown", true);
  }
  let output = Joi.validate(input, schema, options);
  if (output.error) {
    throw generateError(output.error);
  }
  if (!allowImmutable) {
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export const formatInvoiceData = input => {
  let metadata = _.omit(input, _.concat(mutableFields, createMutableFields));
  deleteProperties(input, _.keys(_.omit(input, _.concat(mutableFields, createMutableFields))));
  if (!_.has(input, "metadata")) _.set(input, "metadata", {});
  _.assignIn(_.get(input, "metadata"), metadata);
  return input;
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