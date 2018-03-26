import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Customer from "../../src/customer/customer";

const assert = chai.assert;
const should = chai.should();

if (!process.env.npm_config_SECRET_KEY && !process.env.SECRET_KEY) {
  console.error("\nPlease provide Stripe secret key for tests (npm --SECRET_KEY=YOUR_KEY test or set as env variable).\n\n");
  process.exit();
}

const stush = new Stush({
  secret: process.env.npm_config_SECRET_KEY ? process.env.npm_config_SECRET_KEY : process.env.SECRET_KEY,
  subscription_model: "single"
});

describe("Customer", () => {

  describe("Create with minimal arguments (email)", () => {
    let customer;
    const email = "foo@atyantik.com";

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
    });

    it("should successfully create customer", () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["email", "id", "object"], "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.object", ""), "customer", "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.email", ""), email, "Email did not match");
      assert.match(_.get(customer, "data.id", ""), /^cus_.+$/, "Invalid Stripe customer ID");
    });
  });

  describe("Create with extra unknown properties", () => {
    let customer;
    const email = "foo@atyantik.com",
      extraValue = "extras";

    before(async () => {
      customer = new Customer(stush, {
        email: email,
        extra_1: extraValue,
        extra_2: extraValue,
        extra_3: extraValue,
      });
      await customer.save();
    });

    it("should add extra unknown properties to metadata", async () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["email", "id", "metadata", "object"], "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.object", ""), "customer", "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.email", ""), email, "Email did not match");
      assert.match(_.get(customer, "data.id", ""), /^cus_.+$/, "Invalid Stripe customer ID");
      assert.containsAllKeys(customer.data.metadata, ["extra_1", "extra_2", "extra_3"], "Failed to add extra params to metadata");
      assert.doesNotHaveAnyKeys(customer.data, ["extra_1", "extra_2", "extra_3"], "Failed to remove extra params from customer obj base level");
      assert.equal(_.get(customer, "data.metadata.extra_1", ""), extraValue, "extra_1 did not match");
      assert.equal(_.get(customer, "data.metadata.extra_2", ""), extraValue, "extra_2 did not match");
      assert.equal(_.get(customer, "data.metadata.extra_3", ""), extraValue, "extra_3 did not match");
    });
  });

  describe("Create with all possible arguments", () => {
    let customer;
    const args = {
      account_balance: 0,
      business_vat_id: "vat_id",
      description: "Description goes here.",
      email: "foo@atyantik.com",
      metadata: {extra_1: "extras"},
      shipping: {
        address: {
          line1: "address line 1",
          city: "City of London",
          country: "GB",
          line2: "address line 2",
          postal_code: "NE17",
          state: "London"
        },
        name: "Shipping name",
        phone: "9988552244"
      },
      source: "tok_mastercard"
    };

    before(async () => {
      customer = new Customer(stush, args);
      await customer.save();
    });

    it("should successfully create a valid customer instance", async () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, [
        "email", "id", "account_balance", "business_vat_id", "description", "metadata", "shipping", "source", "object"
      ], "Invalid stush Customer instance");
      assert.hasAllKeys(_.get(customer, "data.shipping", ""), [
        "address", "name", "phone"
      ], "Invalid shipping object in stush Customer instance");
      assert.hasAllKeys(_.get(customer, "data.shipping.address", ""), [
        "line1", "city", "country", "line2", "postal_code", "state"
      ], "Invalid address object in shipping in stush Customer instance");
      assert.equal(_.get(customer, "data.object", ""), "customer", "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.email", ""), _.get(args, "email", ""), "Email did not match");
      assert.equal(_.get(customer, "data.account_balance", ""), _.get(args, "account_balance", ""), "account_balance did not match");
      assert.equal(_.get(customer, "data.business_vat_id", ""), _.get(args, "business_vat_id", ""), "business_vat_id did not match");
      assert.equal(_.get(customer, "data.description", ""), _.get(args, "description", ""), "description did not match");
      assert.equal(_.get(customer, "data.source", ""), _.get(args, "source", ""), "source did not match");
      assert.equal(_.get(customer, "data.metadata.extra_1", ""), _.get(args, "metadata.extra_1", ""), "metadata.extra_1 did not match");
      assert.equal(_.get(customer, "data.shipping.address.line1", ""), _.get(args, "shipping.address.line1", ""), "shipping.address.line1 did not match");
      assert.equal(_.get(customer, "data.shipping.address.city", ""), _.get(args, "shipping.address.city", ""), "shipping.address.city did not match");
      assert.equal(_.get(customer, "data.shipping.address.country", ""), _.get(args, "shipping.address.country", ""), "shipping.address.country did not match");
      assert.equal(_.get(customer, "data.shipping.address.line2", ""), _.get(args, "shipping.address.line2", ""), "shipping.address.line2 did not match");
      assert.equal(_.get(customer, "data.shipping.address.postal_code", ""), _.get(args, "shipping.address.postal_code", ""), "shipping.address.postal_code did not match");
      assert.equal(_.get(customer, "data.shipping.address.state", ""), _.get(args, "shipping.address.state", ""), "shipping.address.state did not match");
      assert.equal(_.get(customer, "data.shipping.name", ""), _.get(args, "shipping.name", ""), "shipping.name did not match");
      assert.equal(_.get(customer, "data.shipping.phone", ""), _.get(args, "shipping.phone", ""), "shipping.phone did not match");
      assert.match(_.get(customer, "data.id", ""), /^cus_.+$/, "Invalid Stripe customer ID");
      assert.match(_.get(customer, "data.default_source", ""), /^card_.+$/, "Invalid Stripe default source ID");
    });
  });

  describe("Create without email", () => {
    let err, customer;

    before(async () => {
      try {
        customer = new Customer(stush, {gibberish: "cus_asdf123asdf"});
        await customer.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw email validation error", async () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("child \"email\" fails because [\"email\" must be a string]");
    });
  });

  describe("Create with empty email property", () => {
    let err, customer;

    before(async () => {
      try {
        customer = new Customer(stush, {email: ""});
        await customer.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw email validation error", async () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("child \"email\" fails because [\"email\" is not allowed to be empty]");
    });
  });

  describe("Create with invalid email address", () => {
    let err, customer;

    before(async () => {
      try {
        customer = new Customer(stush, {email: "gibberish"});
        await customer.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw email validation error", async () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("child \"email\" fails because [\"email\" must be a valid email]");
    });
  });

  describe("Update all properties that can be updated", () => {
    let customer;
    const email = "foo@atyantik.com";
    const args = {
      account_balance: 500,
      business_vat_id: "vat_id",
      description: "Description goes here.",
      shipping: {
        address: {
          line1: "address line 1",
          city: "City of London",
          country: "GB",
          line2: "address line 2",
          postal_code: "NE17",
          state: "London"
        },
        name: "Shipping name",
        phone: "9988552244"
      },
      source: "tok_mastercard",
      // To go in metadata
      extra_1: "extras"
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      customer.set(args, true);
      await customer.save();
    });

    it("should update the properties successfully", () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["email", "id", "object"], "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.object", ""), "customer", "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.email", ""), email, "Email did not match");
      assert.equal(_.get(customer, "data.account_balance", ""), _.get(args, "account_balance", ""), "account_balance did not match");
      assert.equal(_.get(customer, "data.business_vat_id", ""), _.get(args, "business_vat_id", ""), "business_vat_id did not match");
      assert.equal(_.get(customer, "data.description", ""), _.get(args, "description", ""), "description did not match");
      assert.equal(_.get(customer, "data.source", ""), _.get(args, "source", ""), "source did not match");
      assert.equal(_.get(customer, "data.metadata.extra_1", ""), _.get(args, "extra_1", ""), "metadata.extra_1 did not match");
      assert.equal(_.get(customer, "data.shipping.address.line1", ""), _.get(args, "shipping.address.line1", ""), "shipping.address.line1 did not match");
      assert.equal(_.get(customer, "data.shipping.address.city", ""), _.get(args, "shipping.address.city", ""), "shipping.address.city did not match");
      assert.equal(_.get(customer, "data.shipping.address.country", ""), _.get(args, "shipping.address.country", ""), "shipping.address.country did not match");
      assert.equal(_.get(customer, "data.shipping.address.line2", ""), _.get(args, "shipping.address.line2", ""), "shipping.address.line2 did not match");
      assert.equal(_.get(customer, "data.shipping.address.postal_code", ""), _.get(args, "shipping.address.postal_code", ""), "shipping.address.postal_code did not match");
      assert.equal(_.get(customer, "data.shipping.address.state", ""), _.get(args, "shipping.address.state", ""), "shipping.address.state did not match");
      assert.equal(_.get(customer, "data.shipping.name", ""), _.get(args, "shipping.name", ""), "shipping.name did not match");
      assert.equal(_.get(customer, "data.shipping.phone", ""), _.get(args, "shipping.phone", ""), "shipping.phone did not match");
      assert.match(_.get(customer, "data.id", ""), /^cus_.+$/, "Invalid Stripe customer ID");
    });
  });

  describe("Update properties that cannot be updated", () => {
    let customer;
    const email = "foo@atyantik.com";
    const args = {
      delinquent: true,
      discount: {}
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      customer.set(args, true);
      await customer.save();
    });

    it("should not update the properties", () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["email", "id"], "Invalid stush Customer instance");
      assert.notEqual(_.get(customer, "data.delinquent", ""), _.get(args, "delinquent", ""), "delinquent matched");
      assert.notEqual(_.get(customer, "data.discount", ""), _.get(args, "discount", ""), "discount matched");
      assert.match(_.get(customer, "data.id", ""), /^cus_.+$/, "Invalid Stripe customer ID");
    });
  });

  describe("Update a mix of properties that can be updated, and that can't be updated", () => {
    let customer;
    const email = "foo@atyantik.com";
    const args = {
      account_balance: 500,
      business_vat_id: "vat_id",
      description: "Description goes here.",
      delinquent: true,
      discount: {}
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      customer.set(args, true);
      await customer.save();
    });

    it("should only update the properties that can be updated, and ignore the ones that can't be updated", () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["email", "id"], "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.account_balance", ""), _.get(args, "account_balance", ""), "account_balance did not match");
      assert.equal(_.get(customer, "data.business_vat_id", ""), _.get(args, "business_vat_id", ""), "business_vat_id did not match");
      assert.equal(_.get(customer, "data.description", ""), _.get(args, "description", ""), "description did not match");
      assert.notEqual(_.get(customer, "data.delinquent", ""), _.get(args, "delinquent", ""), "delinquent matched");
      assert.notEqual(_.get(customer, "data.discount", ""), _.get(args, "discount", ""), "discount matched");
      assert.match(_.get(customer, "data.id", ""), /^cus_.+$/, "Invalid Stripe customer ID");
    });
  });

  describe("Delete a customer", () => {
    let customer, createdCustomer;
    const email = "foo@atyantik.com";

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      createdCustomer = _.cloneDeep(customer.toJson());
      await customer.delete();
    });

    it("should contain a property \"deleted\" with value true (implies deleted)", () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["deleted", "id"], "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.id", ""), _.get(createdCustomer, "data.id", ""), "customer id did not match");
      assert.isTrue(_.get(customer, "data.deleted", ""), "Customer was not deleted");
    });
  });

  describe("Delete a customer without customer id", () => {
    let customer, err;
    const email = "foo@atyantik.com";

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.delete();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying customer ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Valid customer ID is required to delete the customer");
    });
  });

  describe("Self populate a customer", () => {
    let customer, createdCustomer;
    const email = "foo@atyantik.com";

    before(async () => {
      createdCustomer = new Customer(stush, {
        email: email
      });
      await createdCustomer.save();
      customer = new Customer(stush, {
        id: _.get(createdCustomer, "data.id", "")
      });
      await customer.selfPopulate();
    });

    it("should contain properties that imply customer object is populated from Stripe", () => {
      // Assertions
      assert.containsAllKeys(customer, ["data"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["id", "email", "object"], "Invalid stush Customer instance");
      assert.containsAllKeys(customer.data, ["created", "currency", "delinquent", "discount", "livemode", "sources", "subscriptions"], "Doesn't contain all fields that populate from Stripe");
      assert.equal(_.get(customer, "data.object", ""), "customer", "Invalid stush Customer instance");
      assert.equal(_.get(customer, "data.id", ""), _.get(createdCustomer, "data.id", ""), "customer id did not match");
    });
  });

  describe("Self populate a customer without customer id", () => {
    let customer, err;
    const email = "foo@atyantik.com";

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying customer ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid customer ID before self populating");
    });
  });

});