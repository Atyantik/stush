/**
 * Created by ravindra on 13/12/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import {validator as couponSchemaValidator, formatCouponData} from "./schema";
import Source from "../source/source";

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

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    updatedData = formatCouponData(updatedData, allowImmutable);
    this.data = updatedData;
  }

  async save() {
    try {
      await this._stush.stripe.coupons.retrieve(_.get(this, "data.id", ""));
      // Update coupon
      couponSchemaValidator(_.get(this, "data", {}), false);
      let coupon = await this._stush.stripe.coupons.update(
        _.get(this, "data.id", ""),
        _.pick(this.data, ["metadata"])
      );
      this.set(coupon, true);
      return Promise.resolve(this);
    }
    catch (err) {
      try {
        if (_.get(err, "statusCode", 0) === 404) {
          // Create coupon
          couponSchemaValidator(_.get(this, "data", {}), false);
          let coupon = await this._stush.stripe.coupons.create(_.get(this, "data", {}));
          this.set(coupon, true);
          return Promise.resolve(this);
        }
        else {
          return Promise.reject(err);
        }
      }
      catch (e) {
        return Promise.reject(generateError(e));
      }
    }
  }

  async selfPopulate() {
    try {
      if (!_.get(this, "data.id", "")) {
        return Promise.reject("Please provide a valid coupon ID to self populate.");
      }
      const coupon = await this._stush.stripe.coupons.retrieve(_.get(this, "data.id", ""));
      this.set(coupon, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  async delete() {
    try {
      if (!_.get(this, "data.id", "")) {
        return Promise.reject("Please provide a valid coupon ID to delete.");
      }
      const coupon = await this._stush.stripe.coupons.del(_.get(this, "data.id", ""));
      this.set(coupon);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  clone() {
    return new Coupon(this._stush, _.cloneDeep(this.data));
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.get(this, "data")));
  }
}