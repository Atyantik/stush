/**
 * Created by ravindra on 21/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import CustomerSchema, { validator as CustomerSchemaValidator } from "./schema";
import Subscription from "../subscription/subscription";

export default class Customer {
  data = {};
  _stush = {};
  _stripe = {};

  constructor(stushInstance, customerData) {
    this._stush= stushInstance;
    this._stripe = stushInstance.stripe;
    this.set(customerData, true);
  }

  // customer.set({
  //  name: "Tirth",
  //  Surname: "Bodawala"
  // })

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    CustomerSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  async save() {
    try {
      let data = {};
      if (_.has(this.data, "id")) {
        debug("Updating");
        let params = CustomerSchemaValidator(this.data);
        data = await this._stripe.customers.update(this.data.id, params.value);
      }
      else {
        debug("Creating");
        data = await this._stripe.customers.create(this.data);
      }
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async selfPopulate() {
    if (!this.data.id) {
      return Promise.reject(generateError("Please provide a valid customer ID before self populating"));
    }
    try {
      this.data = await this._stripe.customers.retrieve(this.data.id);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  isSubscribed() {
    return _.get(this.data, "subscriptions.data.length", 0) !== 0;
  }

  async addSubscription(args) {
    if (!this.data.id) {
      return Promise.reject(generateError("Please provide a valid customer ID to add a new subscription."));
    }
    let subscription = new Subscription(this._stush ,args);
    debug("In addSubscription(): ", subscription); process.exit();
  }
}
