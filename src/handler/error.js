import _ from "lodash";

export default function(stushError = null, stripeError = null) {
  if (_.isString(stushError)) {
    stushError = {
      message: stushError,
      code: 500
    };
  }
  debug("Throwing error", {stush: stushError, stripe: stripeError});
  return new Error({stush: stushError, stripe: stripeError});
}