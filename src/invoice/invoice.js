/**
 * Created by ravindra on 27/11/17.
 */
import _ from "lodash";
import generateError from "../handler/error";
import InvoiceSchema, {validator as InvoiceSchemaValidator, sanitizePopulateWithUpcoming} from "./schema";

export default class Invoice {
  data = {};
  _stripe = {};

  constructor(stushInstance, data = {}) {
    this._stripe = stushInstance.stripe;
    this.set(data, true);
  }

  static async fetchAllInvoices (stushInstance, args = {}) {
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

  toJson() {
    return JSON.parse(JSON.stringify(_.pick(this, ["data"])));
  }

  async populateWithUpcoming(args) {
    if (!_.has(args, "customer")) {
      return Promise.reject(generateError("Please provide a valid customer ID to add a new subscription."));
    }
    let params = sanitizePopulateWithUpcoming(args);
    let upcomingInvoice = await this._stripe.invoices.retrieveUpcoming(args.customer, params);
    this.set(upcomingInvoice, true);
  }

  calculateProration(proration_date = "now") {
    let currentProrations = [];
    let cost = 0, invoiceItem = {};
    for (invoiceItem of this.data.lines.data) {
      if (invoiceItem.period.start == proration_date) {
        currentProrations.push(invoiceItem);
        cost += invoiceItem.amount;
      }
    }
    return {
      proration_cost: cost,
      proration_items: currentProrations
    };
  }
}