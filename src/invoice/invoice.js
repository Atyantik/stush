/**
 * Created by ravindra on 27/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import InvoiceSchema, {validator as InvoiceSchemaValidator, sanitizePopulateWithUpcoming} from "./schema";

export default class Invoice {
  data = {};
  _stush = {};

  constructor(stushInstance, data = {}) {
    this._stush = stushInstance;
    this.set(data, true);
  }

  static async fetchAll (stushInstance, args = {}) {
    try {
      const invoices = await stushInstance.stripe.invoices.list(args);
      let set = new Set();
      for (let invoice of invoices.data) {
        set.add(new Invoice(stushInstance, invoice));
      }
      return Promise.resolve(set);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  set(data, allowImmutable = false) {
    let updatedData = _.cloneDeep(this.data);
    _.assignIn(updatedData, data);
    InvoiceSchemaValidator(updatedData, allowImmutable);
    this.data = updatedData;
  }

  async save () {
    try {
      let data;
      if (_.has(this, "data.id")) {
        // Update this invoice.
      }
      else {
        // Create a new invoice.
        data = await this._stush.stripe.invoices.create(this.data);
      }
      this.set(data, true);
      return Promise.resolve(this);
    }
    catch (err) {
      return Promise.reject(err);
    }
  }

  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

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
    return {
      proration_cost: cost,
      proration_items: currentProrations
    };
  }
}