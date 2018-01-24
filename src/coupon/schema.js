/**
 * Created by ravindra on 29/11/17.
 */
import Joi from "joi";
import _ from "lodash";
import generateError from "../handler/error";

const schema = Joi.object().keys({
  id: Joi.string().token(),
  object: Joi.string().valid("coupon"),
  amount_off: Joi.number().positive().allow(null),
  created: Joi.number().positive(),
  currency: Joi.string().when("amount_off", {
    is: Joi.exist(),
    then: Joi.string().length(3, "utf8").required(),
    otherwise: Joi.string().length(3, "utf8").allow(null)
  }).allow(null),
  duration: Joi.string().valid("forever", "once", "repeating").required(),
  duration_in_months: Joi.number().positive().allow(null),
  livemode: Joi.boolean(),
  max_redemptions: Joi.number().positive().allow(null),
  metadata: Joi.object(),
  percent_off: Joi.number().positive().allow(null),
  redeem_by: Joi.number().allow(null),
  times_redeemed: Joi.number().positive().allow(0),
  valid: Joi.boolean(),
  deleted: Joi.boolean()
}).or("amount_off", "percent_off")
  .without("amount_off", ["percent_off"])
  .without("percent_off", ["amount_off"]);

const mutableFields = [
  "id",
  "duration",
  "amount_off",
  "currency",
  "duration_in_months",
  "max_redemptions",
  "metadata",
  "percent_off",
  "redeem_by",
  "deleted",
];

const immutableFields = [
  "object",
  "created",
  "livemode",
  "times_redeemed",
  "valid",
];

export const validator = (input, allowImmutable = false) => {
  let output = Joi.validate(input, schema, {allowUnknown: true}, (err, value) => {
    const errors = _.filter(_.get(err, "details", []), (item) => {
      return !(allowImmutable && _.get(item, "type", "") === "object.without" && (_.get(item, "context.main", "") === "amount_off" || _.get(item, "context.main", "") === "percent_off"));
    });
    _.set(err, "details", errors);
    if (errors.length) {
      throw generateError(err);
    }
  });
  if (!allowImmutable) {
    _.set(output, "value", stripEmptyObjects(_.pick(input, mutableFields)));
  }
  return output;
};

export const formatCouponData = (input, allowImmutable = false) => {
  let filter = allowImmutable ? _.concat(mutableFields, immutableFields) : mutableFields;
  let metadata = _.omit(input, filter);
  deleteProperties(input, _.keys(_.omit(input, filter)));
  if (!_.has(input, "metadata")) _.set(input, "metadata", {});
  _.assignIn(_.get(input, "metadata"), metadata);
  return input;
};

export default schema;