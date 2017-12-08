/**
 * Created by ravindra on 28/11/17.
 */
import _ from "lodash";
import PlanSchema, {validator as PlanSchemaValidator, formatPlanData} from "./schema";
import generateError from "../handler/error";

export default class Plan {
  data = {};
  _stush = {};
  _cache = {};

  constructor (stushInstance, data = {}) {
    this._stush = stushInstance;
    this._cache = stushInstance.fetchCacheInstance();
    this.set(data, true);
  }

  static async fetchAll(stushInstance, args = {}) {
    try {
      const cache = stushInstance.fetchCacheInstance(),
        cacheLifetime = stushInstance.fetchCacheLifetime(),
        cacheKeys = cache.keys();
      let set = [];
      if (cacheKeys.includes("all_plans")) {
        set = cache.get("all_plans");
      }
      else {
        const plans = await stushInstance.stripe.plans.list(args);
        for (let plan of plans.data) {
          set.push(new Plan(stushInstance, plan));
          if (!cacheKeys.includes(_.get(plan, "id"))) {
            cache.put(_.get(plan, "id"), new Plan(stushInstance, plan), cacheLifetime);
          }
        }
        cache.put("all_plans", set, cacheLifetime);
      }
      return Promise.resolve(set);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  set (data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    updatedData = formatPlanData(updatedData);
    this.data = updatedData;
  }

  async save () {
    try {
      let params = PlanSchemaValidator(this.data);
      const data = await this._stush.stripe.plans.update(this.data.id, params.value);
      this._cache.put(data.id, new Plan(this._stush, data), this._stush.fetchCacheLifetime());
      if (!this._cache.keys().includes("all_plans")) {
        await Plan.fetchAll(this._stush);
      }
      else {
        this.updateAllPlansCache(data);
      }
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      if (_.has(err, "raw") && err.raw.param === "plan" && err.raw.statusCode === 404) {
        const data = await this._stush.stripe.plans.create(this.data);
        this._cache.put(data.id, new Plan(this._stush, data), this._stush.fetchCacheLifetime());
        if (!this._cache.keys().includes("all_plans")) {
          await Plan.fetchAll(this._stush);
        }
        else {
          this.updateAllPlansCache(data);
        }
        this.set(data, true);
        return Promise.resolve(this);
      }
      return Promise.reject(err);
    }
  }

  async selfPopulate () {
    if (!this.data.id) {
      return Promise.reject(generateError("Please provide a valid plan ID before self populating"));
    }
    try {
      const cacheKeys = this._cache.keys();
      if (cacheKeys.includes(this.data.id)) {
        this.data = this._cache.get(this.data.id);
      }
      else {
        this.data = await this._stush.stripe.plans.retrieve(this.data.id);
        if (!this._cache.keys().includes("all_plans")) {
          await Plan.fetchAll(this._stush);
        }
        else {
          this.updateAllPlansCache(this.data);
        }
      }
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async delete () {
    try {
      const plan = this.data.id;
      this.data = await this._stush.stripe.plans.del(plan);
      this._cache.del(plan);
      if (!this._cache.keys().includes("all_plans")) {
        await Plan.fetchAll(this._stush);
      }
      else {
        this.updateAllPlansCache(plan, true);
      }
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  toJson () {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  getInterval () {
    return this.data.interval_count + " " + this.data.interval;
  }

  getPrice () {
    return this.data.amount;
  }

  static async cacheAllPlans() {
    try {
      await Plan.fetchAll(this._stush);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  updateAllPlansCache(newPlan, deletingPlan = false) {
    const cache = this._stush.fetchCacheInstance();
    const plans = cache.get("all_plans");
    for (let plan of plans) {
      _.remove(plans, () => {
        return plan.id === newPlan.id;
      });
    }
    if (!deletingPlan) {
      plans.push(new Plan(this._stush, newPlan));
    }
  }
}