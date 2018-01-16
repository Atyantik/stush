import Joi from "joi";
import _ from "lodash";
import generateError from "../handler/error";

const schema = Joi.object().keys({
  id: Joi.string(),
  object: Joi.string(),
  created: Joi.number().positive(),
  currency: Joi.string().allow(null),
  delinquent: Joi.boolean(),
  discount: Joi.object().allow(null),
  livemode: Joi.boolean(),
  sources: Joi.object(),
  subscriptions: Joi.object(),
  email: Joi.string().email().when("id", {is: !Joi.exist(), then: Joi.required()}),
  metadata: Joi.object(),
  source: Joi.string().token(),
  default_source: Joi.string().token().allow(null),
  account_balance: Joi.number().min(0),
  business_vat_id: Joi.string().allow(null),
  coupon: Joi.string().allow(null),
  description: Joi.string().allow(null),
  shipping: Joi.object().keys({
    name: Joi.string().required(),
    phone: Joi.string(),
    address: Joi.object().keys({
      line1: Joi.string().required(),
      city: Joi.string(),
      country: Joi.string(),
      line2: Joi.string(),
      postal_code: Joi.string(),
      state: Joi.string()
    }).required()
  }).allow(null)
});

export const previewProrationSchema = Joi.object().keys({
  subscription: Joi.alternatives([Joi.string().token(), Joi.object()]),
  cancellation_proration: Joi.boolean().default(false),
  plan_to_change: Joi.string(),
  plan: Joi.string().when("cancellation_proration", {is: false, then: Joi.required()}),
  prorate_from: Joi.number().positive().when("cancellation_proration", {is: false, then: Joi.required()})
});

export const cancelSubscriptionSchema = Joi.object().keys({
  subscription: Joi.string().token(),
  cancel: Joi.string().valid("now", "after_billing_cycle").default("now"),
  refund: Joi.number().positive(),
  refund_value_from: Joi.number().positive().default(_.ceil(new Date().getTime()/1000)).when("refund", {is: Joi.exist(), then: Joi.strip()}),
});

export const validator = (input, allowImmutable = false) => {
  // process the input
  let options = {};
  if (allowImmutable) {
    _.set(options, "allowUnknown", true);
  }
  let output = Joi.validate(input, schema, options);
  if (output.error) {
    throw generateError(output.error);
  }
  if (!allowImmutable) {
    let mutableFields = [
      "account_balance",
      "default_source",
      "description",
      "discount",
      "email",
      "metadata",
      "shipping",
      "name",
      "statement_descriptor"
    ];
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export const formatCustomerData = (input) => {
  const stripeCustomerKeys = [
    "id",
    "object",
    "email",
    "source",
    "default_source",
    "account_balance",
    "business_vat_id",
    "coupon",
    "description",
    "metadata",
    "created",
    "currency",
    "delinquent",
    "discount",
    "livemode",
    "shipping",
    "sources",
    "subscriptions",
  ];
  let metadata = _.pick(input, _.keys(_.omit(input, stripeCustomerKeys)));
  if (!_.has(input, "metadata")) _.set(input, "metadata", {});
  _.assignIn(_.get(input, "metadata"), metadata);
  deleteProperties(input, _.keys(_.omit(input, stripeCustomerKeys)));
  return input;
};

export const previewProrationValidator = input => {
  let output = Joi.validate(input, previewProrationSchema);
  if (output.error) {
    throw generateError(output.error);
  }
  let subscription = _.get(input, "subscription"),
    subscriptionItem = subscription.fetchSubscriptionItem(_.get(input, "plan_to_change", null));
  _.set(output, "value.plan_to_change", _.get(subscriptionItem, "plan.id"));
  _.set(output, "value.items", [{
    id: subscriptionItem.id,
    plan: _.get(input, "plan")
  }]);
  if (_.get(input, "cancellation_proration")) {
    _.set(output, "value.preview_cancellation_refund", true);
  }
  else {
    _.set(output, "value.preview_proration", true);
  }
  _.unset(output, "value.cancellation_proration");

  return output;
};

export const cancelSubscriptionValidator = (input) => {
  if (_.has(input, "id")) {
    _.set(input, "subscription", _.get(input, "id"));
  }
  let output = Joi.validate(input, cancelSubscriptionSchema, {stripUnknown: true});
  if (output.error) {
    throw generateError(output.error);
  }
  return output;
};

export default schema;