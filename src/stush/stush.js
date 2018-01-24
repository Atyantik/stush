import Stripe from "stripe";
import _ from "lodash";
import memCache from "memory-cache";
import Validator from "./validations";
import Customer from "../customer/customer";
import generateError from "../handler/error";
import BetterQueue from "at-better-queue";
import Worker from "../hook/worker";
import EventEmitter from "events";
import Source from "../source/source";

export default class Stush {
  userOptions = {
    subscription_model: "multiple",
    proration: "change_subscription",
    charge_instantly: false,
    worker_instances: 1,
    cache: new memCache.Cache(),
    cache_plans: 24*3600
  };
  stripe = {};
  _queue = new BetterQueue((task, cb) => {
    Worker.process(task, cb);
  }, {
    concurrent: _.get(this, "userOptions.worker_instances", 1)
  });
  _emitter = new EventEmitter();

  constructor (options) {
    this.validator = new Validator();
    this.validator.validateStushOptions(options);
    _.assignIn(this.userOptions, options);
    this.stripe = new Stripe(_.get(this.userOptions, "secret"));
  }

  /**
   * Fetches webhook secret key for the Stush instance.
   */
  fetchWebhookSecret() {
    return _.get(this, "userOptions.webhook_secret", null);
  }

  /**
   * Fetches subscription model type for the Stush instance.
   */
  fetchModel() {
    return _.get(this, "userOptions.subscription_model");
  }

  /**
   * Fetches proration setting for the Stush instance.
   */
  fetchProrationSetting() {
    return _.get(this, "userOptions.proration");
  }

  /**
   * Fetches "charge_instantly" setting for the Stush instance.
   */
  chargesInstantly() {
    return _.get(this, "userOptions.charge_instantly");
  }

  /**
   * Fetches cache instance for the Stush instance.
   */
  fetchCacheInstance() {
    return _.get(this, "userOptions.cache");
  }

  /**
   * Fetches cache lifetime setting for the Stush instance.
   */
  fetchCacheLifetime() {
    return _.get(this, "userOptions.cache_plans");
  }

  /**
   * Creates a new customer.
   * @param customerData
   * @returns {Promise.<*>}
   */
  async createCustomer (customerData) {
    try {
      let customer = new Customer(this, customerData);
      await customer.save();
      return Promise.resolve(customer);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Fetches a customer.
   * @param customerId
   * @returns {Promise.<*>}
   */
  async fetchCustomer (customerId) {
    try {
      if (!customerId) {
        return Promise.reject("Please provide a valid customer ID to fetch a customer.")
      }
      let customer = new Customer(this, {id: customerId});
      await customer.selfPopulate();
      return Promise.resolve(customer);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  async fetchSource(sourceId = null, customerId = null) {
    try {
      if (!sourceId) {
        return Promise.reject("Source ID is required to fetch source.");
      }
      if (!customerId && !_.startsWith(sourceId, "src")) {
        return Promise.reject("Customer ID is required to fetch the type of source.");
      }
      let source;
      if (_.startsWith(sourceId, "card")) {
        source = await this.stripe.customers.retrieveCard(customerId, sourceId);
      }
      else if (_.startsWith(sourceId, "ba")) {
        source = await this.stripe.customers.retrieveSource(customerId, sourceId);
      }
      else if (_.startsWith(sourceId, "src")) {
        source = await this.stripe.sources.retrieve(sourceId);
      }
      else {
        return Promise.reject("Invalid source ID.");
      }
      return Promise.resolve(new Source(this, source));
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  async processHook(rawBody, stripeSignature) {
    try {
      await this._validateRawBody(rawBody);
      const stripeEvent = await this._verifyHook(rawBody, stripeSignature);
      await this.addToQueue(stripeEvent);
      return Promise.resolve(stripeEvent);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async _validateRawBody(body) {
    try {
      const validJson = JSON.parse(body);
      return Promise.resolve(validJson);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  async addToQueue(stripeEvent) {
    try {
      const params = {
        stushInstance: this,
        stripeEvent: stripeEvent
      };
      this._queue.push(params);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  async on(event, callback) {
    try {
      this._emitter.on(event, callback);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  /**
   * Verifies webhook from Stripe.
   * @param body
   * @param sig
   * @returns {Promise.<*>}
   */
  async _verifyHook(body, sig) {
    try {
      const secret = this.fetchWebhookSecret();
      let response = await this.stripe.webhooks.constructEvent(body, sig, secret);
      return Promise.resolve(response);
    }
    catch (err) {
      return Promise.reject(generateError(null, err));
    }
  }
}