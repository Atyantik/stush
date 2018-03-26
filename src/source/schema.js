/**
 * Created by ravindra on 29/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "../handler/error";

const schema = Joi.object().keys({
  id: Joi.string().token(),
  object: Joi.string().valid("source", "card", "bank_account"),
  usage: Joi.string().valid("reusable", "single_use"),
  amount: Joi.number().min(0).allow(null).when("usage", {is: "single_use", then: Joi.required()}),
  client_secret: Joi.string().token(),
  code_verification: Joi.object().keys({
    attempts_remaining: Joi.number().min(0),
    status: Joi.string().valid("pending", "succeeded", "failed")
  }),
  created: Joi.number().positive(),
  currency: Joi.string().when("usage", {
    is: "single_use",
    then: Joi.string().required().length(3, "utf8"),
    otherwise: Joi.string().length(3, "utf8")
  }),   // Source, Bank Account
  flow: Joi.string().valid("redirect", "receiver", "code_verification", "none"),
  livemode: Joi.boolean(),
  metadata: Joi.object(),       // Source, Bank Account, Card
  owner: Joi.object().keys({
    address: Joi.object().keys({
      city: Joi.string(),
      country: Joi.string().length(2, "utf8"),
      line1: Joi.string(),
      line2: Joi.string(),
      postal_code: Joi.string(),
      state: Joi.string()
    }).allow(null),
    email: Joi.string().email().allow(null),
    name: Joi.string().allow(null),
    phone: Joi.string().allow(null),
    verified_address: Joi.object().keys({
      city: Joi.string(),
      country: Joi.string().length(2, "utf8"),
      line1: Joi.string(),
      line2: Joi.string(),
      postal_code: Joi.string(),
      state: Joi.string()
    }).allow(null),
    verified_email: Joi.string().email().allow(null),
    verified_name: Joi.string().allow(null),
    verified_phone: Joi.string().allow(null)
  }),
  receiver: Joi.object().keys({
    address: Joi.string(),
    amount_charged: Joi.number().min(0),
    amount_received: Joi.number().min(0),
    amount_returned: Joi.number().min(0)
  }),
  redirect: Joi.object().keys({
    failure_reason: Joi.string().allow("user_abort", "declined", "processing_error"),
    return_url: Joi.string(),
    status: Joi.string().valid("pending", "succeeded", "not_required", "failed"),
    url: Joi.string()
  }),
  statement_descriptor: Joi.string().allow(null),
  status: Joi.string().valid(
    "canceled", "chargeable", "consumed", "failed", "pending",          // Source
    "new", "validated", "verified", "verification_failed", "errored"    // Bank Account
  ),
  type: Joi.string().valid("card", "ach_credit_transfer", "three_d_secure", "giropay", "sepa_debit", "ideal", "sofort", "bancontact", "alipay"),
  // Bank Account Object Fields
  account: Joi.string(),
  account_holder_name: Joi.string(),
  account_holder_type: Joi.string().valid("individual", "company"),
  bank_name: Joi.string(),
  country: Joi.string().length(2),         // Bank Account, Card
  default_for_currency: Joi.boolean(),
  fingerprint: Joi.string().token().allow(null),     // Bank Account, Card
  last4: Joi.string().length(4),           // Bank Account, Card
  routing_number: Joi.string(),
  // Card Object Fields
  address_city: Joi.string().allow(null),
  address_country: Joi.string().allow(null),
  address_line1: Joi.string().allow(null),
  address_line1_check: Joi.string().valid("pass", "fail", "unavailable", "unchecked").allow(null),
  address_line2: Joi.string().allow(null),
  address_state: Joi.string().allow(null),
  address_zip: Joi.string().allow(null),
  address_zip_check: Joi.string().valid("pass", "fail", "unavailable", "unchecked").allow(null),
  brand: Joi.string().valid("Visa", "American Express", "MasterCard", "Discover", "JCB", "Diners Club", "Unknown"),
  customer: Joi.string().token(),
  cvc_check: Joi.string().valid("pass", "fail", "unavailable", "unchecked").allow(null),
  dynamic_last4: Joi.string().allow(null),
  exp_month: Joi.number().positive(),
  exp_year: Joi.number().positive(),
  funding: Joi.string().valid("credit", "debit", "prepaid", "unknown"),
  name: Joi.string().allow(null),
  tokenization_method: Joi.string().valid("apple_pay", "android_pay").allow(null),
  deleted: Joi.boolean().optional()
});

const stripeCardKeys = [
    "source",
    "metadata",
    "id",
    "address_city",
    "address_country",
    "address_line1",
    "address_line2",
    "address_state",
    "address_zip",
    "exp_month",
    "exp_year",
    "name",
  ],
  immutableCardKeys = [
    "object",
    "brand",
    "country",
    "dynamic_last4",
    "fingerprint",
    "funding",
    "last4",
    "tokenization_method",
  ];

const stripeBankAccountKeys = [
    "source",
    "metadata",
    "id",
    "account_holder_name",
    "account_holder_type",
  ],
  immutableBankAccountKeys = [
    "object",
    "account",
    "bank_name",
    "country",
    "currency",
    "default_for_currency",
    "fingerprint",
    "last4",
    "routing_number",
    "status",
    "name",
  ];

const stripeSourceKeys = [
    "mandate",
    "metadata",
    "owner",
  ],
  immutableSourceKeys = [
    "object",
    "account",
    "client_secret",
    "created",
    "currency",
    "flow",
    "livemode",
    "receiver",
    "statement_descriptor",
    "status",
    "type",
    "usage",
    "ach_credit_transfer"
  ];

export const validator = (input, allowImmutable = false) => {
  let output = Joi.validate(input, schema, {allowUnknown: true});
  if (output.error) {
    throw generateError(output.error);
  }
  if (!allowImmutable) {
    let mutableFields = [
      "metadata",
      "owner",
      "account_holder_name",
      "account_holder_type",
      "address_city",
      "address_country",
      "address_line1",
      "address_line2",
      "address_state",
      "address_zip",
      "exp_month",
      "exp_year",
      "name",
    ];
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export const formatSourceData = (input, common = true) => {
  let metadata;
  if (common) {
    metadata = _.pick(input, _.keys(_.omit(input, _.keys(input, schema))));
  }
  else {
    let sourceId = _.get(input, "id", "");
    if (_.startsWith(sourceId, "card")) {
      deleteProperties(input, _.keys(_.pick(input, immutableCardKeys)));
      metadata = _.omit(input, stripeCardKeys);
      deleteProperties(input, _.keys(_.omit(input, stripeCardKeys)));
    }
    else if (_.startsWith(sourceId, "ba")) {
      deleteProperties(input, _.keys(_.pick(input, immutableBankAccountKeys)));
      metadata = _.omit(input, stripeBankAccountKeys);
      deleteProperties(input, _.keys(_.omit(input, stripeBankAccountKeys)));
    }
    else {
      if (_.startsWith(sourceId, "src")) {
        deleteProperties(input, _.keys(_.pick(input, immutableSourceKeys)));
      }
      metadata = _.omit(input, stripeSourceKeys);
      deleteProperties(input, _.keys(_.omit(input, stripeSourceKeys)));
    }
  }
  if (!_.has(input, "metadata")) _.set(input, "metadata", {});
  _.assignIn(_.get(input, "metadata"), metadata);
  return input;
};

export default schema;