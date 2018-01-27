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

  /**
   * Fetches all plans.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */
  static async fetchAll(stushInstance, args = {}) {
    try {
      const cache = stushInstance.fetchCacheInstance(),
        cacheLifetime = stushInstance.fetchCacheLifetime(),
        cacheKeys = cache.keys();
      let set = [];
      if (cacheKeys.length <= 0 || _.get(args, "refresh_cache", "") || !cacheKeys.includes("all_plans")) {
        _.unset(args, "refresh_cache");
        const plans = await stushInstance.stripe.plans.list(args);
        for (let plan of plans.data) {
          cache.put(_.get(plan, "id"), new Plan(stushInstance, plan), cacheLifetime);
        }
        cache.put("all_plans", set, cacheLifetime);
      }
      set = cache.get("all_plans");
      return Promise.resolve(set);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Setter method for data(Also formats and validates data being set).
   * @param data
   * @param allowImmutable
   */
  set (data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    updatedData = formatPlanData(updatedData, allowImmutable);
    this.data = updatedData;
  }

  /**
   * Attempts to update the plan; falls back to creating one.
   * @returns {Promise.<*>}
   */
  async oldSave () {
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
      debug("Caught error >>>>>>>>> ", err);
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
      return Promise.reject(generateError(err));
    }
  }

  async save() {
    try {
      // If a plan doesn't exist, then flow will go to catch block.
      await this._stush.stripe.plans.retrieve(_.get(this, "data.id", ""));
      let params = _.cloneDeep(this);
      _.unset(params, "data.id");
      PlanSchemaValidator(_.get(params, "data", {}));
      const data = await this._stush.stripe.plans.update(
        _.get(this, "data.id", ""),
        _.get(params, "data", {})
      );
      // Update cache
      this._cache.put(
        _.get(data, "id", ""),
        new Plan(this._stush, data), this._stush.fetchCacheLifetime()
      );
      // If all_plans cache key doesn't exist then fetch and cache it; otherwise, update it.
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
      try {
        if (_.get(err, "statusCode", 0) === 404) {
          PlanSchemaValidator(_.get(this, "data", {}));
          const data = await this._stush.stripe.plans.create(
            _.get(this, "data", {})
          );
          // Update cache
          this._cache.put(
            _.get(data, "id", ""),
            new Plan(this._stush, data), this._stush.fetchCacheLifetime()
          );
          // If all_plans cache key doesn't exist then fetch and cache it; otherwise, update it.
          if (!this._cache.keys().includes("all_plans")) {
            await Plan.fetchAll(this._stush);
          }
          else {
            this.updateAllPlansCache(data);
          }
          this.set(data, true);
          return Promise.resolve(this);
        }
        else {
          debug("In first catch >>>>>>> ", err);
          return Promise.reject(generateError(err));
        }
      }
      catch (e) {
        debug("In second catch >>>>>>> ", e);
        return Promise.reject(generateError(e));
      }
    }
  }

  /**
   * Populates the local plan from Stripe.
   * @returns {Promise.<*>}
   */
  async selfPopulate () {
    if (!this.data.id) {
      return Promise.reject(generateError("Please provide a valid plan ID before self populating"));
    }
    try {
      let data;
      const cacheKeys = this._cache.keys();
      if (cacheKeys.includes(this.data.id)) {
        data = this._cache.get(this.data.id).data;
      }
      else {
        data = await this._stush.stripe.plans.retrieve(this.data.id);
        if (!this._cache.keys().includes("all_plans")) {
          await Plan.fetchAll(this._stush);
        }
        else {
          this.updateAllPlansCache(this.data);
        }
      }
      _.assignIn(this.data, data);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Deletes the plan.
   * @returns {Promise.<*>}
   */
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
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Returns data in JSON format.
   */
  toJson () {
    return JSON.parse(JSON.stringify(_.get(this, "data")));
  }

  /**
   * Fetches total interval of the plan.
   * @returns {string}
   */
  getInterval () {
    return this.data.interval_count + " " + this.data.interval;
  }

  /**
   * Fetches price of the plan.
   * @returns {schema.amount|{is, then}|*}
   */
  getPrice () {
    return this.data.amount;
  }

  /**
   * Updates the "all_plans" cache key data.
   * @param newPlan
   * @param deletingPlan
   */
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