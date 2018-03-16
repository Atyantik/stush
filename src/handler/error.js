import _ from "lodash";

export default function(stushError = null, statusCode = 500, code = null) {
  let error;
  if (_.isString(stushError)) {
    error = new Error(stushError);
    error.isStushError = true;
    error.statusCode = statusCode;
    error.code = code;
  }
  else if (_.get(stushError, "isJoi", false)) {
    error = stushError;
    error.statusCode = 422;
    error.details = _.head(_.get(stushError, "details", []));
  }
  else if (_.get(stushError, "isStushError", false)) {
    error = stushError;
  }
  else {
    error = stushError;
    error.isStripeError = true;
  }

  return error;
}