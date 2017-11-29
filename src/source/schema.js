/**
 * Created by ravindra on 29/11/17.
 */
import Joi from "joi";

const schema = Joi.object().keys({
  id: Joi.string().token(),
  object: Joi.string().valid("source"),
  usage: Joi.string().valid("reusable", "single_use"),
  amount: Joi.number().min(0).when("usage", {is: "single_use", then: Joi.required()}),
  client_secret: Joi.string().token(),
  code_verification: Joi.object().keys({
    attempts_remaining: Joi.number().min(0),
    status: Joi.string().valid("pending", "succeeded", "failed")
  }),
  created: Joi.number().positive(),
  currency: Joi.string().length(3, "utf8").when("usage", {is: "single_use", then: Joi.required()}),
  flow: Joi.string().valid("redirect", "receiver", "code_verification", "none"),
  livemode: Joi.boolean(),
  metadata: Joi.object(),
  owner: Joi.object().keys({
    address: Joi.object().keys({
      city: Joi.string(),
      country: Joi.string().length(2, "utf8"),
      line1: Joi.string(),
      line2: Joi.string(),
      postal_code: Joi.string(),
      state: Joi.string()
    }),
    email: Joi.string().email(),
    name: Joi.string(),
    phone: Joi.string(),
    verified_address: Joi.object().keys({
      city: Joi.string(),
      country: Joi.string().length(2, "utf8"),
      line1: Joi.string(),
      line2: Joi.string(),
      postal_code: Joi.string(),
      state: Joi.string()
    }),
    verified_email: Joi.string().email(),
    verified_name: Joi.string(),
    verified_phone: Joi.string()
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
  statement_descriptor: Joi.string(),
  status: Joi.string().valid("canceled", "chargeable", "consumed", "failed", "pending"),
  type: Joi.string().valid("card", "three_d_secure", "giropay", "sepa_debit", "ideal", "sofort", "bancontact", "alipay")
});

export default schema;