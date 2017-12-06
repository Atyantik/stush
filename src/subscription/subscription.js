/**
 * Created by ravindra on 22/11/17.
 */
import _ from "lodash";
import SubscriptionSchema, {validator as SubscriptionSchemaValidator, formatSubscriptionData, stripConfigOptions, formatChangeSubscriptionInput, changeSubscriptionValidator} from "./schema";
import generateError from "../handler/error";
import Plan from "../plan/plan";
import Invoice from "../invoice/invoice";

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
    updatedData = formatSubscriptionData(updatedData);
    debug("Formatted sub data: ", updatedData);
    SubscriptionSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  async save() {
    try {
      let data = {};
      // stripConfigOptions(this.data);
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

  clone() {
    return new Subscription(this._stush, _.cloneDeep(this.data));
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  fetchSubscriptionItem(planId = null) {
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

  fetchLatestPlan() {
    const subscriptionItems = _.get(this.data, "items.data");
    for (let value of subscriptionItems) {
      if (_.has(value, "plan")) {
        return Promise.resolve(_.get(value, "plan.id"));
      }
    }
  }

  async backupchange(subscription) {
    try {
      _.set(args, "subscription", this);
      const args = formatChangeSubscriptionInput(subscription);
      let params = {},
        input = changeSubscriptionValidator(args);
      _.set(params, "items", _.get(input, "value.items", []));
      const prorationEnabled = this._stush.fetchProrationSetting();
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
        upgradingPlan = _.get(newPlan, "data.amount") > _.get(planToChange, "data.amount"),
        chargeInstantly = this._stush.chargesInstantly();
      // Update the subscription.
      this.data = await this._stush.stripe.subscriptions.update(this.data.id, params);
      if (!changeInBillingCycle && !freeToPaid && upgradingPlan && chargeInstantly) {
        // Create an invoice to initiate payment collection instantly.
        debug("Creating invoice to initiate payment collection");
        let invoice = new Invoice(this._stush, {
          customer: _.get(this, "data.customer"),
          subscription: _.get(this, "data.id")
        });
        await invoice.save();
        debug("New invoice created.");
      }
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async change(subscription) {
    if (!subscription) {
      throw generateError("Subscription to change to is required.");
    }
    try {
      let params = {},
        subscriptionItem = this.fetchSubscriptionItem();
      _.set(params, "items", _.get(subscription, "data.items"));
      _.set(params, "items[0].id", _.get(subscriptionItem, "id"));
      const prorationEnabled = this._stush.fetchProrationSetting();
      if (prorationEnabled === "all" || prorationEnabled === "change_subscription") {
        _.set(params, "proration_date", _.get(subscription, "data.prorate_from", _.ceil(new Date()/1000)));
      }
      else {
        if (_.has(subscription, "data.prorate_from")) {
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
        id: _.get(this, "data.items.data[0].plan.id")
      });
      await planToChange.selfPopulate();
      const newPlan = new Plan(this._stush, {
        id: _.get(subscription, "data.items[0].plan", _.get(subscription, "data.items.data[0].plan.id"))
      });
      await newPlan.selfPopulate();
      const changeInBillingCycle = planToChange.getInterval() !== newPlan.getInterval(),
        freeToPaid = _.get(planToChange, "data.amount") === 0,
        upgradingPlan = _.get(newPlan, "data.amount") > _.get(planToChange, "data.amount"),
        chargeInstantly = this._stush.chargesInstantly();
      // Update the subscription.
      this.data = await this._stush.stripe.subscriptions.update(this.data.id, params);
      if (!changeInBillingCycle && !freeToPaid && upgradingPlan && chargeInstantly) {
        // Create an invoice to initiate payment collection instantly.
        debug("Creating invoice to initiate payment collection");
        let invoice = new Invoice(this._stush, {
          customer: _.get(this, "data.customer"),
          subscription: _.get(this, "data.id")
        });
        await invoice.save();
      }
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