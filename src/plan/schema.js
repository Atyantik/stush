/**
 * Created by ravindra on 28/11/17.
 */
import Joi from "joi";
import _ from "lodash";

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

export default schema;