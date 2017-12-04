/**
 * Created by ravindra on 22/11/17.
 */
import _ from "lodash";
import SubscriptionSchema, {validator as SubscriptionSchemaValidator, formatSubscriptionData, changeSubscriptionValidator} from "./schema";
import generateError from "../handler/error";
import Plan from "../plan/plan";

export default class Subscription {
  data = {};
  _stush = {};

  constructor(stushInstance, subscriptionData) {
    this._stush = stushInstance;
    this.set(subscriptionData);
  }

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    debug("In sub set (before): ", updatedData);
    updatedData = formatSubscriptionData(updatedData);
    debug("In sub set: ", updatedData);
    SubscriptionSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  async save() {
    try {
      let data = {};
      if (_.has(this.data, "id")) {
        let params = SubscriptionSchemaValidator(this.data);
        debug("Updating Subscription with: ", this.data);
        data = await this._stush.stripe.subscriptions.update(this.data.id, params.value);
      }
      else {
        debug("Creating Subscription with: ", this.data);
        data = await this._stush.stripe.subscriptions.create(this.data);
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
      this.data = await this._stush.stripe.subscriptions.retrieve(this.data.id);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  extractSubscriptionItem(planId = null) {
    const subscriptionItems = _.get(this.data, "items.data");
    let requiredSubscriptionItem;
    if (planId) {
      for (let value of subscriptionItems) {
        if (planId === value.plan.id) {
          requiredSubscriptionItem = value;
          break;
        }
      }
      if (!requiredSubscriptionItem) {
        throw generateError("Specified customer is not subscribed to subscription with provided plan.");
      }
    }
    else {
      requiredSubscriptionItem = _.get(this.data, "items.data.[0]", {});
    }
    return requiredSubscriptionItem;
  }

  extractLatestPlan() {
    const subscriptionItems = _.get(this.data, "items.data");
    for (let value of subscriptionItems) {
      if (_.has(value, "plan")) {
        return _.get(value, "plan.id");
      }
    }
  }

  async change(args) {
    try {
      _.set(args, "subscription", this);
      let params = {},
        input = changeSubscriptionValidator(args);
      _.set(params, "items", _.get(input, "value.items", []));
      const prorationEnabled = _.get(this, "_stush.userOptions.enable_proration");
      if (prorationEnabled === "all" || prorationEnabled === "change_subscription") {
        _.set(params, "proration_date", _.get(input, "value.prorate_from", _.ceil(new Date()/1000)));
      }
      else {
        if (_.has(input, "value.prorate_from")) {
          return Promise.reject({
            isJoi: true,
            details: [{
              message: "Proration is disabled in configuration options.",
              code: 500
            }]
          });
        }
        _.set(params, "prorate", false);
      }
      // Check if there is a change in billing period.
      const planToChange = new Plan(this._stush, {
        id: _.get(input, "value.plan_to_change")
      });
      await planToChange.selfPopulate();
      const newPlan = new Plan(this._stush, {
        id: _.get(args, "plan")
      });
      await newPlan.selfPopulate();
      const changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval(),
        freeToPaid = _.get(planToChange, "data.amount") === 0,
        chargeInstantly = _.get(this, "_stush.userOptions.charge_instantly");
      if (!changeInBillingCycle && !freeToPaid && chargeInstantly) {
        // TODO: Manual logic to provision instant charge on plan upgrade.
      }
      this.data = await this._stush.stripe.subscriptions.update(this.data.id, params);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async cancel(atPeriodEnd = false) {
    try {
      let params = {};
      if (atPeriodEnd) {
        _.set(params, "at_period_end", true);
      }
      this.data = await this._stush.stripe.subscriptions.del(this.data.id, params);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }
}

module.exports = Subscription;