/**
 * Created by ravindra on 23/11/17.
 */
import Joi from "joi";
import _ from "lodash";

const stripeSubscriptionKeys = [
  "id",
  "object",
  "application_fee_percent",
  "billing",
  "cancel_at_period_end",
  "canceled_at",
  "created",
  "current_period_end",
  "current_period_start",
  "customer",
  "discount",
  "ended_at",
  "livemode",
  "quantity",
  "start",
  "status",
  "trial_end",
  "trial_start",
  "coupon",
  "days_until_due",
  "items",
  "source",
  "metadata",
  "prorate",
  "proration_date",
  "tax_percent",
  "trial_period_days",
  "trial_ends"
];

// Configuration options for operations on subscription
const configOptionKeys = [
  "cancellation_proration",
  "prorate_from",
  "cancel",
  "refund",
  "refund_value_from",
];

const schema = Joi.object().keys({
  id: Joi.string().token(),
  customer: Joi.string().token(),
  application_fee_percent: Joi.number().positive().precision(2).allow(null),
  billing: Joi.string().valid("charge_automatically", "send_invoice").default("charge_automatically"),
  coupon: Joi.string(),
  days_until_due: Joi.number().when("billing", {is: "send_invoice", then: Joi.number().min(1).required()}).allow(null),
  items: Joi.alternatives([Joi.array().items(Joi.object().keys({
    id: Joi.string().token(),
    deleted: Joi.boolean(),
    metadata: Joi.object(),
    plan: Joi.string().when("id", {is: !Joi.exist(), then: Joi.required()}),
    quantity: Joi.number().min(0)
  })), Joi.object()]),
  metadata: Joi.object(),
  prorate: Joi.boolean(),
  proration_date: Joi.number().positive(),
  source: Joi.string().token(),
  tax_percent: Joi.number().min(0).precision(2).allow(null),
  trial_ends: Joi.number().positive(),
  trial_period_days: Joi.number().positive(),   // Only during creation of subscription.
});

export const changeSubscriptionSchema = Joi.object().keys({
  subscription: Joi.alternatives([Joi.string().token(), Joi.object()]),
  plan_to_change: Joi.string(),
  plan: Joi.string().required(),
  prorate_from: Joi.number().positive()
});

export const validator = (input, allowImmutable = false) => {
  let output = Joi.validate(input, schema, {allowUnknown: true});
  if (output.error) {
    throw output.error;
  }
  if (_.get(output, "value.billing", false) !== "send_invoice") {
    _.unset(output, "value.days_until_due");
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

export const formatSubscriptionData = (input) => {
  const immuneKeys = _.concat(stripeSubscriptionKeys, configOptionKeys);
  if (_.has(input, "plan") && !_.isString(_.get(input, "plan"))) {
    immuneKeys.push("plan");
  }
  else {
    if (!_.has(input, "items")) {
      _.set(input, "items", []);
      input.items.push({
        plan: _.get(input, "plan"),
        quantity: _.get(input, "plan_quantity", 1)
      });
    }
  }
  if (_.get(input, "trial_days", 0) > 0) {
    _.set(input, "trial_period_days", _.get(input, "trial_days"));
  }
  _.unset(input, "trial_days");

  let picks = _.keys(_.omit(input, immuneKeys));
  if (_.isString(_.get(input, "plan"))) {
    _.remove(picks, element => {
      return element === "plan";
    });
  }
  let metadata = _.pick(input, picks);
  if (!_.has(input, "metadata")) _.set(input, "metadata", {});
  _.assignIn(_.get(input, "metadata"), metadata);
  deleteProperties(input, _.keys(_.omit(input, immuneKeys)));
  return input;
};

export const stripConfigOptions = input => {
  return deleteProperties(input, configOptionKeys);
};

export const formatChangeSubscriptionInput = (input, from) => {
  let output = {},
    subscriptionItem = from.fetchSubscriptionItem();
  if (!_.has(input, "data.items") || !_.isArray(_.get(input, "data.items"))) {
    _.set(output, "value.items", [{
      id: subscriptionItem.id,
      plan: _.get(input, "plan")
    }]);
  }
  _.set(output, "value.plan_to_change", _.get(subscriptionItem, "plan.id"));
  return input;
};

export const changeSubscriptionValidator = input => {
  let output = Joi.validate(input, changeSubscriptionSchema);
  if (output.error) {
    throw output.error;
  }
  return output;
};

export default schema;