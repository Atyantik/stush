/**
 * Created by ravindra on 27/11/17.
 */


export default class Invoice {
  data = {};
  _stripe = {};

  constructor(stushInstance, data = {}) {
    this._stripe = stushInstance.stripe;
    this.data = data;
  }

  set(data) {
    //
  }
}