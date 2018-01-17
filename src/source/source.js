/**
 * Created by ravindra on 29/11/17.
 */
import _ from "lodash";
import sourceSchema, {formatSourceData, validator as sourceSchemaValidator} from "./schema";
import generateError from "../handler/error";

export default class Source {
  data = {};
  _stush = {};

  constructor (stushInstance, data) {
    this._stush = stushInstance;
    this.set(data);
  }

  set (data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    updatedData = formatSourceData(updatedData);
    sourceSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  async save() {
    try {
      const sourceId = _.get(this, "data.id", "");
      if (!sourceId) {
        return Promise.reject(generateError("Please provide a valid source ID."));
      }
      const customerId = _.get(this, "data.customer", "");
      let params = formatSourceData(_.get(this, "data", {}));
      let source;
      if (_.startsWith(sourceId, "tok") || _.startsWith(sourceId, "btok")) {
        // Create a card or bank account.
        if (!customerId) {
          return Promise.reject(generateError("Please provide a valid source ID."));
        }
        _.unset(params, "customer");
        _.set(params, "source", _.get(params, "id", ""));
        _.unset(params, "id");
        source = await this._stush.stripe.customers.createSource(customerId, params);
      }
      else if (_.startsWith(sourceId, "card") || _.startsWith(sourceId, "src") || _.startsWith(sourceId, "ba")) {
        // Update card, source, or bank account.
        _.unset(params, "id");
        if (_.startsWith(sourceId, "card") || _.startsWith(sourceId, "ba")) {
          if (!customerId) {
            return Promise.reject(generateError("Please provide a valid source ID."));
          }
          _.unset(params, "customer");
          source = await this._stush.stripe.customers.updateCard(
            customerId,
            sourceId,
            params
          );
        }
        else {
          source = await this._stush.stripe.sources.update(sourceId, params);
        }
      }
      else {
        return Promise.reject(generateError("Invalid source ID provided."));
      }
      this.set(source, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  async selfPopulate() {
    try {
      const sourceId = _.get(this, "data.id", "");
      if (!sourceId) {
        return Promise.reject(generateError("Please provide a valid source ID before self populating"));
      }
      const customerId = _.get(this, "data.customer", "");
      if (!customerId && (_.startsWith(sourceId, "card") || _.startsWith(sourceId, "ba"))) {
        return Promise.reject(generateError("Please provide a valid customer ID before self populating card or bank account"));
      }
      let source;
      if (_.startsWith(sourceId, "card")) {
        source = await this._stush.stripe.customers.retrieveCard(customerId, sourceId);
      }
      else if (_.startsWith(sourceId, "src")) {
        source = await this._stush.stripe.sources.retrieve(sourceId);
      }
      else if (_.startsWith(sourceId, "ba")) {
        source = await this._stush.stripe.customers.retrieveSource(customerId, sourceId);
      }
      else {
        return Promise.reject(generateError("Invalid source ID provided"));
      }
      this.set(source, true);
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
}