/**
 * Created by ravindra on 29/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";

export default class Source {
  data = {};
  _stripe = {};

  constructor (stushInstance, data) {
    this._stripe = stushInstance.stripe;
    this.set(data);
  }

  set (data) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    // TODO: Validate data here
    this.data = updatedData;
  }

  // async selfPopulate () {
  //   if (!this.data.id) {
  //     throw generateError("Please provide a valid Source ID before self populating.");
  //   }
  //   try {
  //     const thisSource = this._stripe.sources.retrieve(this.data.id);
  //     debug(thisSource);
  //   }
  //   catch (err) {
  //     return Promise.reject(err);
  //   }
  // }
}