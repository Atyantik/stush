/**
 * Created by ravindra on 27/11/17.
 */
import Joi from "joi";

const schema = Joi.object().keys({
  //
});

export const validator = (input) => {
  return Joi.validate(input, schema);
};

export default schema;