/**
 * Created by ravindra on 30/11/17.
 */
import _ from "lodash";

export default class Refund {
  data = {};
  _stush = {};

  constructor (stushInstance, data = {}) {
    this._stush = stushInstance;
    this.set(data);
  }

  set (data) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    // TODO: Validate data here
    this.data = updatedData;
  }

  toJson () {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }
}