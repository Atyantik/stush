/**
 * Created by ravindra on 22/11/17.
 */
import _ from "lodash";
import SubscriptionSchema, {validator as SubscriptionSchemaValidator} from "./schema";

export default class Subscription {
  data = {};
  _stripe = {};
  constructor(stushInstance, subscriptionData) {
    this._stripe = stushInstance;
    this.set(subscriptionData);
  }

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    SubscriptionSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  async save() {
    //
  }

  create(args) {
    return this._stripe.subscriptions.create(args)
      .then((subscription) => {
        return Promise.resolve(subscription);
      }).catch((error) => {
        return Promise.reject(error);
      });
  }
}

module.exports = Subscription;