/**
 * Created by ravindra on 21/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";

export default class Customer {
  data = {};
  static stripe = {};
  constructor(selfInstance, args) {
    this.stripe = selfInstance.stripe;
    this.data = args;
  }

  async save() {
    try {
      if (_.has(this.data, "id")) {
        let updateFields = [
          "account_balance","business_vat_id","coupon",
          "default_source","description","metadata","source"
        ];
        if (this.data.shipping) {
          updateFields.push("shipping");
        }
        this.data = await this.stripe.customers.update(this.data.id, _.pick(this.data, updateFields));
      }
      else {
        this.data = await this.stripe.customers.create(this.data);
      }
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async selfPopulate() {
    try {
      this.data = await this.stripe.customers.retrieve(this.data.id);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  getCustomer(customerId) {
    return this.stripe.customers.retrieve(customerId)
      .then((customer) => {
        return Promise.resolve(customer);
      }).catch((error) => {
        return Promise.reject(error);
      });
  }

  isSubscribed() {
    return _.get(this.data, "subscriptions.data.length", 0) !== 0;
  }
}

module.exports = Customer;