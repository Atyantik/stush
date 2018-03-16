import util from "util";
import _ from "lodash";
import generateError from "../handler/error";

const __development = process.env.NODE_ENV === "development";

const debug = (...args) => {
  if (!__development) return;
  // eslint-disable-next-line
  return console.log(
    "\n--------------------------------------------------------------------------------\n",
    util.inspect(args, false, 15, true),
    "\n--------------------------------------------------------------------------------\n"
  );
};

const deleteProperties = (object, array) => {
  array.forEach((value) => {
    _.unset(object, value);
  });
  return object;
};

const stripEmptyObjects = (object) => {
  if (typeof object !== "object") {
    throw {
      isJoi: true,
      details: [{
        message: "Invalid argument. Argument of type 'object' expected.",
        code: 500
      }]
    };
  }
  let array = _.toPairs(object);
  _.remove(array, ([key, value]) => {
    debug(key, value, typeof value);
    return typeof value === "object" && isEmpty(value);
  });
  return _.fromPairs(array);
};

const isEmpty = (obj) => {
  for(let key in obj) {
    if(obj.hasOwnProperty(key))
      return false;
  }
  return true;
};

export const makeUtilsGlobal = () => {
  global.debug = debug;
  global.deleteProperties = deleteProperties;
  global.stripEmptyObjects = stripEmptyObjects;
};