/**
 * Created by ravindra on 29/11/17.
 */
import _ from "lodash";

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
    // Validate data here
    this.data = updatedData;
  }
}