/**
 * Created by ravindra on 28/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "../handler/error";

const schema = Joi.object().keys({
  id: Joi.string(),
  object: Joi.string().valid("plan"),
  amount: Joi.number().min(0),
  currency: Joi.string().length(3, "utf8"),
  interval: Joi.string().valid("day", "week", "month", "year"),
  interval_count: Joi.number(),
  livemode: Joi.boolean(),
  metadata: Joi.object(),
  name: Joi.string(),
  statement_descriptor: Joi.string()
});

const mutableFields = [
  "id",
  "currency",
  "interval",
  "amount",
  "interval_count",
  "metadata",
  "name",
  "statement_descriptor"
];

const stripePlanKeys = [
  "object",
  "created",
  "livemode",
  "trial_period_days",
];

export const validator = (input, allowImmutable = false) => {
  let options = {};
  if (allowImmutable) {
    _.set(options, "allowUnknown", true);
  }
  let output = Joi.validate(input, schema, options, (err, value) => {
    if (err) {
      throw generateError(err);
    }
  });
  if (!allowImmutable) {
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export const formatPlanData = (input, allowImmutable) => {
  if (_.has(input, "price")) {
    _.set(input, "amount", _.get(input, "price", 0)*100);
    _.unset(input, "price");
  }
  if (_.has(input, "bill_every")) {
    // Formatting interval input for stripe.
    const daily = ["day", "days", "daily", "everyday", "day-to-day"],
      weekly = ["week", "weeks", "weekly"],
      monthly = ["month", "months", "monthly"],
      yearly = ["year", "yearly"];
    let interval = _.get(input, "bill_every", "");
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
  let filter = allowImmutable ? _.concat(mutableFields, stripePlanKeys) : mutableFields;
  let metadata = _.omit(input, filter);
  deleteProperties(input, _.keys(_.omit(input, filter)));
  if (!_.has(input, "metadata")) _.set(input, "metadata", {});
  _.assignIn(_.get(input, "metadata"), metadata);
  return input;
};

export default schema;