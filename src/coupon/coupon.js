/**
 * Created by ravindra on 13/12/17.
 */
import _ from "lodash";

export default class Coupon {
  data = {};
  _stush = {};

  constructor(stushInstance, data) {
    this._stush = stushInstance;
    this.set(data);
  }

  static async fetchAll(stushInstance, args = {}) {
    try {
      let couponArray = [];
      const coupons = await stushInstance.stripe.coupons.list(args);
      coupons.data.forEach(value => {
        couponArray.push(new Coupon(stushInstance, value));
      });
      return Promise.resolve(couponArray);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  set(data) {
    const updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    this.data = updatedData;
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.get(this, "data")));
  }
}