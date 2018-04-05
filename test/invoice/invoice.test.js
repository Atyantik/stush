/**
 * Created by ravindra on 2/4/18.
 */
import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Customer from "../../src/customer/customer";
import Invoice from "../../src/invoice/invoice";
import Subscription from "../../src/subscription/subscription";

const assert = chai.assert;
const should = chai.should();

const email = "invoice@atyantik.com";

if (!process.env.npm_config_SECRET_KEY && !process.env.SECRET_KEY) {
  console.error("\nPlease provide Stripe secret key for tests (npm --SECRET_KEY=YOUR_KEY test or set as env variable).\n\n");
  process.exit();
}

const stush = new Stush({
  secret: process.env.npm_config_SECRET_KEY ? process.env.npm_config_SECRET_KEY : process.env.SECRET_KEY,
  subscription_model: "single"
});

describe("Invoice", () => {

  describe("Create an invoice with quantity and unit price", () => {
    let customer, invoice;
    const item = {
      currency: "usd",
      unit_amount: 1000,
      quantity: 2
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully create an invoice", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(
        _.get(invoice, "data.amount_due", ""),
        _.get(item, "quantity", "")*_.get(item, "unit_amount", ""),
        "Amount due did not match."
      );
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
    });
  });

  describe("Create an invoice with fixed amount", () => {
    let customer, invoice;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully create an invoice", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
    });
  });

  describe("Update all properties that can be updated", () => {
    let customer, invoice;
    const item = {
        currency: "usd",
        amount: 1000
      }, params = {
        description: "This is updated description",
        statement_descriptor: "statement_descriptor",
        tax_percent: 0,
        extra: "extra",
      };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      deleteProperties(invoice.data, ["closed", "forgiven", "paid"]);
      invoice.set(params,true);
      await invoice.save();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully update the properties that can be updated", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
      assert.equal(_.get(invoice, "data.description", ""), _.get(params, "description", ""), "description did not match.");
      assert.equal(_.get(invoice, "data.statement_descriptor", ""), _.get(params, "statement_descriptor", ""), "statement_descriptor did not match.");
      assert.equal(_.get(invoice, "data.tax_percent", ""), _.get(params, "tax_percent", ""), "tax_percent did not match.");
      assert.equal(_.get(invoice, "data.metadata.extra", ""), _.get(params, "extra", ""), "extra did not match.");
    });
  });

  describe("Close an invoice", () => {
    let customer, invoice;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      deleteProperties(invoice.data, ["forgiven", "paid"]);
      invoice.set({
        closed: true
      },true);
      await invoice.save();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully close the invoice", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
      assert.isTrue(_.get(invoice, "data.closed", ""), "Failed to close the invoice.");
    });
  });

  describe("Forgive an invoice", () => {
    // Invoice must be closed before forgiving
    let customer, invoice;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      deleteProperties(invoice.data, ["forgiven", "paid"]);
      invoice.set({
        closed: true
      },true);
      await invoice.save();
      deleteProperties(invoice.data, ["closed", "paid"]);
      invoice.set({
        forgiven: true
      },true);
      await invoice.save();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully forgive the invoice", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
      assert.isTrue(_.get(invoice, "data.closed", ""), "Invoice was not closed.");
      assert.isTrue(_.get(invoice, "data.forgiven", ""), "Failed to forgive the invoice.");
    });
  });

  describe("Update closed, forgiven, and paid simultaneously", () => {
    let customer, invoice, err;
    const item = {
        currency: "usd",
        amount: 1000
      }, params = {
        closed: true,
        forgiven: true,
        paid: true,
      };

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        await customer.addInvoiceItem(item);
        invoice = new Invoice(stush, {
          customer: _.get(customer, "data.id", "")
        });
        await invoice.save();
        invoice.set(params,true);
        await invoice.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await customer.delete();
    });

    it("should throw an error saying all properties can't be updated simultaneously", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Received both paid and closed parameters. Please pass in only one.");
    });
  });

  describe("Self populate an invoice", () => {
    let customer, invoice, createdInvoice;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      createdInvoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await createdInvoice.save();
      invoice = new Invoice(stush, {
        id: _.get(createdInvoice, "data.id", "")
      });
      await invoice.selfPopulate();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully self populate the instance", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
    });
  });

  describe("Self populate an invoice without invoice ID", () => {
    let customer, invoice, err;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        invoice = new Invoice(stush, {});
        await invoice.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await customer.delete();
    });

    it("should throw an error saying invoice ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid invoice ID to self populate.");
    });
  });

  describe("Self populate an upcoming invoice for a subscription", () => {
    let customer, invoice, subscription, addedSubscription;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      subscription = new Subscription(stush, {
        plan: "lite",
        source: "tok_visa"
      });
      addedSubscription = await customer.addSubscription(subscription);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", ""),
        subscription: _.get(addedSubscription, "data.id", "")
      });
      await invoice.populateWithUpcoming();
    });

    after(async () => {
      await addedSubscription.cancel();
      await customer.delete();
    });

    it("should throw an error saying invoice ID is required", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["object", "customer"], "Invalid Stush Invoice instance.");
      assert.doesNotHaveAllKeys(invoice.data, ["id"], "Invalid Stush Upcoming Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
    });
  });

  describe("Self populate an upcoming invoice without customer ID", () => {
    let invoice, err;

    before(async () => {
      try {
        invoice = new Invoice(stush, {});
        await invoice.populateWithUpcoming();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying invoice ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid customer ID to fetch upcoming invoice.");
    });
  });

  describe("Self populate an upcoming invoice without subscription ID", () => {
    let customer, invoice, err;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        invoice = new Invoice(stush, {
          customer: _.get(customer, "data.id", "")
        });
        await invoice.populateWithUpcoming();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await customer.delete();
    });

    it("should throw an error saying invoice ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid subscription to fetch upcoming invoice.");
    });
  });

  describe("Pay an invoice manually", () => {
    let customer, invoice;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email,
        source: "tok_visa"
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      await invoice.pay();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully pay the invoice", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
      assert.isTrue(_.get(invoice, "data.attempted", ""), "Failed to attempt to pay the invoice.");
      assert.isTrue(_.get(invoice, "data.paid", ""), "Failed to pay the invoice.");
      assert.isTrue(_.get(invoice, "data.closed", ""), "Failed to close after paying the invoice.");
      assert.isNotNull(_.get(invoice, "data.charge", ""), "Failed to create a charge for the invoice.");
    });
  });

  describe("Pay an invoice manually with different card", () => {
    let customer, invoice;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email,
        source: "tok_visa"
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      await invoice.pay(_.get(customer, "data.default_source", ""));
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully pay the invoice", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
      assert.isTrue(_.get(invoice, "data.attempted", ""), "Failed to attempt to pay the invoice.");
      assert.isTrue(_.get(invoice, "data.paid", ""), "Failed to pay the invoice.");
      assert.isTrue(_.get(invoice, "data.closed", ""), "Failed to close after paying the invoice.");
      assert.isNotNull(_.get(invoice, "data.charge", ""), "Failed to create a charge for the invoice.");
    });
  });

  describe("Pay an invoice manually without invoice ID", () => {
    let invoice, err;

    before(async () => {
      try {
        invoice = new Invoice(stush, {});
        await invoice.pay();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying invoice ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Invoice ID is required to pay an invoice. Instantiate with a valid invoice ID.");
    });
  });

  describe("Fetch invoice line items", () => {
    let customer, invoice, invoiceItems;
    const items = [
      {
        description: "Item 1",
        currency: "usd",
        amount: 1000
      },
      {
        description: "Item 2",
        currency: "usd",
        amount: 2000
      }
    ];

    before(async () => {
      customer = new Customer(stush, {
        email: email,
        source: "tok_visa"
      });
      await customer.save();
      await Promise.all(items.map(async (value) => {
        await customer.addInvoiceItem(value);
      }));
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      invoiceItems = await invoice.fetchItems();
    });

    after(async () => {
      await customer.delete();
    });

    it("should successfully fetch all the invoice line items", () => {
      // Assertions
      let amountDue = 0, invoiceItemsArr = [];
      items.map((item) => {
        amountDue += _.get(item, "amount", 0);
      });
      invoiceItems.data.map((invoiceItem) => {
        invoiceItemsArr.push({
          amount: _.get(invoiceItem, "amount", ""),
          currency: _.get(invoiceItem, "currency", ""),
          description: _.get(invoiceItem, "description", "")
        });
      });
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoiceItems, ["data"], "Invalid invoice items list.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(invoiceItems.data.length, 2, "Number of items did not match.");
      assert.includeDeepMembers(invoiceItemsArr, items);
      assert.equal(_.get(invoice, "data.amount_due", ""), amountDue, "Amount did not match.");
    });
  });

  describe("Fetch invoice line items without invoice ID", () => {
    let invoice, invoiceItems, err;

    before(async () => {
      try {
        invoice = new Invoice(stush, {});
        invoiceItems = await invoice.fetchItems();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying invoice ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid invoice ID to fetch its line items.");
      assert.isUndefined(invoiceItems, "Value was assigned to invoiceItems");
    });
  });

  describe("Calculate proration on generated invoice", () => {
    let customer, invoice, err;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        await customer.addInvoiceItem(item);
        invoice = new Invoice(stush, {
          customer: _.get(customer, "data.id", "")
        });
        await invoice.save();
        await invoice.calculateProration(Math.ceil(new Date().getTime()/1000 + 100000));
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await customer.delete();
    });

    it("should throw an error saying proration cannot be calculated only on upcoming invoice.", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Proration can only be calculated on an upcoming invoice.");
    });
  });

  describe("Test utility methods on Invoice class", () => {
    let customer, invoice, json;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      json = invoice.toJson();
    });

    after(async () => {
      await customer.delete();
    });

    it("should return correct json of Coupon instance", () => {
      // Assertions
      assert.containsAllKeys(invoice, ["data"], "Invalid Stush Invoice instance.");
      assert.containsAllKeys(invoice.data, ["id", "object", "customer"], "Invalid Stush Invoice instance.");
      assert.equal(_.get(invoice, "data.object", ""), "invoice", "Invalid Invoice object type.");
      assert.equal(_.get(invoice, "data.amount_due", ""), _.get(item, "amount", ""), "Amount did not match.");
      assert.equal(_.get(invoice, "data.currency", ""), _.get(item, "currency", ""), "Currency did not match.");
      assert.deepEqual(json, _.get(invoice, "data", ""), "invoice.toJson() failed");
    });
  });

  describe("Fetch all invoices", () => {
    let customer, invoice, invoices;
    const item = {
      currency: "usd",
      amount: 1000
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      await customer.addInvoiceItem(item);
      invoice = new Invoice(stush, {
        customer: _.get(customer, "data.id", "")
      });
      await invoice.save();
      invoices = await Invoice.fetchAll(stush, {
        limit: 5
      });
    });

    after(async () => {
      await customer.delete();
    });

    it("should return an array of Invoice instances", () => {
      // Assertions
      assert.isAtLeast(invoices.length, 1, "Less than 1 invoices fetched");
      assert.isAtMost(invoices.length, 5, "More than 5 invoices fetched");
      invoices.map((invoice) => {
        assert.instanceOf(invoice, Invoice, "Not an instance of Invoice");
      });
    });
  });

});