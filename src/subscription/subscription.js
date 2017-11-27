/**
 * Created by ravindra on 22/11/17.
 */
import _ from "lodash";
import SubscriptionSchema, {validator as SubscriptionSchemaValidator} from "./schema";
import generateError from "../handler/error";

export default class Subscription {
  data = {};
  _stripe = {};
  constructor(stushInstance, subscriptionData) {
    this._stripe = stushInstance.stripe;
    this.set(subscriptionData);
  }

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    SubscriptionSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  async save() {
    try {
      let data = {};
      if (_.has(this.data, "id")) {
        let params = SubscriptionSchemaValidator(this.data);
        debug("Updating Subscription with: ", this.data);
        data = await this._stripe.subscriptions.update(this.data.id, params.value);
      }
      else {
        debug("Creating Subscription with: ", this.data);
        data = await this._stripe.subscriptions.create(this.data);
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
      return Promise.reject(generateError("Please provide a valid subscription ID before self populating"));
    }
    try {
      this.data = await this._stripe.subscriptions.retrieve(this.data.id);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  async cancel(atPeriodEnd = false) {
    try {
      let params = {};
      if (atPeriodEnd) {
        _.set(params, "at_period_end", true);
      }
      this.data = await this._stripe.subscriptions.del(this.data.id, params);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = Subscription;