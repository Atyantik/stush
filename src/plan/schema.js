/**
 * Created by ravindra on 28/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "../handler/error";

const schema = Joi.object().keys({
  id: Joi.string().required(),
  object: Joi.string().valid("plan"),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().length(3, "utf8").required(),
  interval: Joi.string().valid("day", "week", "month", "year").required(),
  interval_count: Joi.number(),
  livemode: Joi.boolean(),
  metadata: Joi.object(),
  name: Joi.string().required(),
  statement_descriptor: Joi.string()
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
      "metadata",
      "name",
      "statement_descriptor"
    ];
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export const formatPlanData = (input) => {
  if (_.get(input, "price", null)) {
    _.set(input, "amount", _.get(input, "price"));
  }
  if (_.has(input, "bill_every")) {
    // Formatting interval input for stripe.
    const daily = ["day", "days", "daily", "everyday", "day-to-day"],
      weekly = ["week", "weeks", "weekly"],
      monthly = ["month", "months", "monthly"],
      yearly = ["year", "yearly"];
    let interval = _.get(input, "bill_every");
    const intervalArr = _.split(_.get(input, "bill_every"), " ", 2);
    if (intervalArr.length > 1) {
      Joi.attempt(_.head(intervalArr), Joi.number()); // throws if fails
      if (_.head(intervalArr) > 1) {
        _.set(input, "interval_count", _.parseInt(_.head(intervalArr)));
      }
      interval = _.last(intervalArr);
    }
    if (daily.includes(interval)) {
      interval = "day";
    }
    else if (weekly.includes(interval)) {
      interval = "week";
    }
    else if (monthly.includes(interval)) {
      interval = "month";
    }
    else if (yearly.includes(interval)) {
      interval = "year";
    }
    else {
      throw generateError("Unable to parse \"bill_every\" value.");
    }
    _.set(input, "interval", interval);
  }
  // Formatting additional properties as metadata.
  let stripePlanKeys = [
    "id",
    "name",
    "object",
    "amount",
    "created",
    "currency",
    "livemode",
    "metadata",
    "interval",
    "interval_count",
    "trial_period_days",
    "statement_descriptor",
  ];
  let metadata = _.pick(input, _.keys(_.omit(input, stripePlanKeys)));
  _.set(input, "metadata", metadata);
  deleteProperties(input, _.keys(_.omit(input, stripePlanKeys)));
  return input;
};

export default schema;