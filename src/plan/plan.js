/**
 * Created by ravindra on 28/11/17.
 */
import _ from "lodash";
import PlanSchema, {validator as PlanSchemaValidator} from "./schema";

export default class Plan {
  data = {};
  _stripe = {};

  constructor (stushInstance, data = {}) {
    this._stripe = stushInstance.stripe;
    this.set(data, true);
  }

  set (data, allowImmutable = false) {
    this.data = data;
  }

  async save () {
    try {
      let data = {};
      if (_.has(this.data, "id")) {
        debug("Updating Plan with: ", this.data);
        let params = PlanSchemaValidator(this.data);
        data = await this._stripe.plans.update(this.data.id, params.value);
      }
      else {
        debug("Updating Plan with: ", this.data);
        data = await this._stripe.plans.create(this.data);
      }
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }
}