/**
 * Created by ravindra on 29/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";

export default class Source {
  data = {};
  _stush = {};

  constructor (stushInstance, data) {
    this._stush = stushInstance;
    this.set(data);
  }

  set (data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    this.data = updatedData;
  }

  async save() {
    try {
      //
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Returns data in JSON format.
   */
  toJson () {
    return JSON.parse(JSON.stringify(_.get(this, "data")));
  }
}