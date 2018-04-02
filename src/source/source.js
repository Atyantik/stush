/**
 * Created by ravindra on 29/11/17.
 */
import _ from "lodash";
import sourceSchema, {formatSourceData, validator as sourceSchemaValidator} from "./schema";
import generateError from "../handler/error";
import Customer from "../customer/customer";

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
      let source;
      if (_.startsWith(sourceId, "tok") || _.startsWith(sourceId, "btok")) {
        // Create a card or bank account.
        if (!customerId) {
          return Promise.reject(generateError("Please provide a valid customer ID."));
        }
        let params = formatSourceData(_.get(this, "data", {}));
        _.set(params, "metadata", _.omit(this.data, ["source", "metadata", "id"]));
        deleteProperties(params, _.keys(_.omit(params, ["source", "metadata", "id"])));
        _.set(params, "source", _.get(params, "id", ""));
        _.unset(params, "id");
        source = await this._stush.stripe.customers.createSource(customerId, params);
      }
      else if (_.startsWith(sourceId, "card") || _.startsWith(sourceId, "src") || _.startsWith(sourceId, "ba")) {
        // Update card, source, or bank account.
        let params = formatSourceData(_.get(this, "data", {}), false);
        _.unset(params, "id");
        if (_.startsWith(sourceId, "card") || _.startsWith(sourceId, "ba")) {
          if (!customerId) {
            return Promise.reject(generateError("Please provide a valid customer ID."));
          }
          _.unset(params, "customer");
          _.unset(params, "source");
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

  async delete() {
    try {
      const sourceId = _.get(this, "data.id", "");
      if (!sourceId) {
        return Promise.reject(generateError("Please provide a valid source ID."));
      }
      const customerId = _.get(this, "data.customer", "");
      if (!customerId) {
        return Promise.reject(generateError("Please provide a valid customer ID."));
      }
      let source;
      if (_.startsWith(sourceId, "card")) {
        source = await this._stush.stripe.customers.deleteCard(customerId, sourceId);
      }
      else if (_.startsWith(sourceId, "ba") || _.startsWith(sourceId, "src")) {
        source = await this._stush.stripe.customers.deleteSource(customerId, sourceId);
      }
      else {
        return Promise.reject(generateError("Please provide a valid source ID."));
      }
      this.set(source, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  clone() {
    return new Source(this._stush, _.cloneDeep(this.data));
  }

  async attachTo(customer) {
    try {
      let attachedSource;
      const sourceId = _.get(this, "data.id", "");
      if (_.startsWith(sourceId, "tok") || _.startsWith(sourceId, "src") || _.startsWith(sourceId, "btok")) {
        if (_.isString(customer)) {
          attachedSource = await this._stush.stripe.customers.createSource(customer, {source: sourceId});
        }
        else if (customer instanceof Customer) {
          attachedSource = await this._stush.stripe.customers.createSource(_.get(customer, "data.id", ""), {source: sourceId});
        }
        else {
          return Promise.reject(generateError("Please provide a valid customer ID or Customer instance."));
        }
        this.set(attachedSource, true);
        return Promise.resolve(this);
      }
      else {
        return Promise.reject(generateError("Please provide a valid source ID."));
      }
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