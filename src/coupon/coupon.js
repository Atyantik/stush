/**
 * Created by ravindra on 13/12/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import {validator as couponSchemaValidator, formatCouponData} from "./schema";

export default class Coupon {
  data = {};
  _stush = {};

  constructor(stushInstance, data, allowImmutable = false) {
    this._stush = stushInstance;
    this.set(data, allowImmutable);
  }

  static async fetchAll(stushInstance, args = {}) {
    try {
      let couponArray = [];
      const coupons = await stushInstance.stripe.coupons.list(args);
      coupons.data.forEach(value => {
        couponArray.push(new Coupon(stushInstance, value, true));
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
    // Validation is done only for save -- separately for create and update.
    this.data = updatedData;
  }

  async save() {
    try {
      await this._stush.stripe.coupons.retrieve(_.get(this, "data.id", ""));
      // Update coupon: Stripe only allows to update metadata after creation of a Coupon.
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
        // Create coupon if no Coupon exists for the provided coupon ID.
        if (_.get(err, "statusCode", 0) === 404) {
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
        return Promise.reject(generateError("Please provide a valid coupon ID to self populate."));
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
        return Promise.reject(generateError("Please provide a valid coupon ID to delete."));
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
    let clone = new Coupon(this._stush, {});
    clone.set(this.data, true);
    return clone;
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.get(this, "data")));
  }
}