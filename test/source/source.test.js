import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Customer from "../../src/customer/customer";
import Source from "../../src/source/source";

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

describe("Source", () => {

  describe("Create card with minimal arguments (customer ID and token)", () => {
    let source, customer;
    const email = "source@atyantik.com";

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: "tok_visa",
        customer: _.get(customer, "data.id", "")
      });
      await source.save();
    });

    it("should create a source for the provided customer", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["id", "object", "brand", "customer"], "Invalid stush Source instance");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Customer instance");
      assert.equal(_.get(source, "data.brand", ""), "Visa", "Card brand did not match");
      assert.equal(_.get(source, "data.customer", ""), _.get(customer, "data.id", ""), "Customer did not match");
      assert.match(_.get(source, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
    });
  });

  describe("Create card with all possible parameters", () => {
    let source, customer;
    const email = "source@atyantik.com",
      extraValue = "extras",
      params = {
        id: "tok_visa",
        extra_1: extraValue,
        extra_2: extraValue
      };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      _.set(params, "customer", _.get(customer, "data.id", ""));
      source = new Source(stush, params);
      await source.save();
    });

    it("should create a source for the provided customer", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["id", "object", "brand", "customer"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data.metadata, ["extra_1", "extra_2"], "Invalid stush Source instance");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Customer instance");
      assert.equal(_.get(source, "data.brand", ""), "Visa", "Card brand did not match");
      assert.equal(_.get(source, "data.customer", ""), _.get(customer, "data.id", ""), "Customer did not match");
      assert.equal(_.get(source, "data.metadata.extra_1", ""), extraValue, "Extra 1 metadata did not match");
      assert.equal(_.get(source, "data.metadata.extra_1", ""), extraValue, "Extra 2 metadata did not match");
      assert.match(_.get(source, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
    });
  });

  describe("Create card without customer id", () => {
    let source, err;

    before(async () => {
      try {
        source = new Source(stush, {
          id: "tok_visa"
        });
        await source.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying customer ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid customer ID.");
    });
  });

  describe("Create card without source id or token", () => {
    let source, customer, err;
    const email = "source@atyantik.com";

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        source = new Source(stush, {
          customer: _.get(customer, "data.id", "")
        });
        await source.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying source ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid source ID.");
    });
  });

  describe("Update card with minimal arguments (customer ID and token)", () => {
    let source, customer;
    const email = "source@atyantik.com";

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: "tok_visa",
        customer: _.get(customer, "data.id", "")
      });
      await source.save();
    });

    it("should create a source for the provided customer", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["id", "object", "brand", "customer"], "Invalid stush Source instance");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Customer instance");
      assert.equal(_.get(source, "data.brand", ""), "Visa", "Card brand did not match");
      assert.equal(_.get(source, "data.customer", ""), _.get(customer, "data.id", ""), "Customer did not match");
      assert.match(_.get(source, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
    });
  });

});