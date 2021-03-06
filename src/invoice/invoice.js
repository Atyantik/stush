/**
 * Created by ravindra on 27/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import InvoiceSchema, {
  validator as InvoiceSchemaValidator, sanitizePopulateWithUpcoming,
  formatInvoiceData
} from "./schema";

export default class Invoice {
  data = {};
  _stush = {};

  constructor(stushInstance, data = {}) {
    this._stush = stushInstance;
    this.set(data, true);
  }

  /**
   * Fetches all invoices.
   * @param stushInstance
   * @param args
   * @returns {Promise.<*>}
   */
  static async fetchAll (stushInstance, args = {}) {
    try {
      const invoices = await stushInstance.stripe.invoices.list(args);
      let set = [];
      for (let invoice of invoices.data) {
        set.push(new Invoice(stushInstance, invoice));
      }
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
  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    updatedData = formatInvoiceData(updatedData);
    InvoiceSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  /**
   * Creates a new Stripe invoice.
   * @returns {Promise.<*>}
   */
  async save () {
    try {
      let data;
      let params = _.cloneDeep(_.get(this, "data", {}));
      if (_.has(this, "data.id")) {
        // Update this invoice.
        _.unset(params, "id");
        _.unset(params, "customer");
        data = await this._stush.stripe.invoices.update(_.get(this, "data.id", ""), params);
      }
      else {
        // Create a new invoice.
        data = await this._stush.stripe.invoices.create(_.get(this, "data", {}));
      }
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  async selfPopulate() {
    try {
      if (!_.get(this, "data.id", "")) {
        return Promise.reject("Please provide a valid invoice ID to self populate.");
      }
      const invoice = await this._stush.stripe.invoices.retrieve(_.get(this, "data.id", ""));
      this.set(invoice, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  async fetchItems() {
    try {
      if (!_.get(this, "data.id", "")) {
        return Promise.reject("Please provide a valid invoice ID to fetch its line items.");
      }
      const invoiceItems = await this._stush.stripe.invoices.retrieveLines(_.get(this, "data.id", ""));
      return Promise.resolve(invoiceItems);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Returns data in JSON format.
   */
  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  async pay(sourceId = null) {
    if (!this.data.id) {
      return Promise.reject(generateError("Invoice ID is required to pay an invoice. Instantiate with a valid invoice ID."));
    }
    try {
      const params = sourceId ? {source: sourceId} : {};
      const invoice = await this._stush.stripe.invoices.pay(this.data.id, params);
      this.set(invoice, true);
    }
    catch (err) {
      return Promise.reject(generateError(err));
    }
  }

  /**
   * Populates the local invoice instance from Stripe with upcoming invoice.
   * @param args
   * @returns {Promise.<*>}
   */
  async populateWithUpcoming(args) {
    if (!_.has(args, "customer")) {
      return Promise.reject(generateError("Please provide a valid customer ID to add a new subscription."));
    }
    if (!_.has(args, "subscription")) {
      return Promise.reject(generateError("Please provide a valid subscription to fetch upcoming invoice."));
    }
    let params = sanitizePopulateWithUpcoming(args);
    let upcomingInvoice = await this._stush.stripe.invoices.retrieveUpcoming(args.customer, args.subscription, params);
    this.set(upcomingInvoice, true);
  }

  /**
   * Calculates and provides proration details.
   * @param proration_date
   * @param changeInBillingCycle
   * @returns {Promise.<{proration_cost: number, proration_items: Array}>}
   */
  calculateProration(proration_date, changeInBillingCycle = false) {
    let currentProrations = [];
    let cost = 0, invoiceItem = {};
    if (changeInBillingCycle) {
      cost = this.data.subtotal;
      currentProrations = this.data.lines.data;
    }
    else {
      for (invoiceItem of this.data.lines.data) {
        if (invoiceItem.period.start == proration_date) {
          currentProrations.push(invoiceItem);
          cost += invoiceItem.amount;
        }
      }
    }
    return Promise.resolve({
      proration_cost: cost,
      proration_items: currentProrations
    });
  }
}