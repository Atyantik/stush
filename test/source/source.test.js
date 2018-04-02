import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Customer from "../../src/customer/customer";
import Source from "../../src/source/source";

const assert = chai.assert;
const should = chai.should();

const email = "source@atyantik.com";
const sourceToken = "tok_visa";

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

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      await source.save();
    });

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should create a card for the provided customer", () => {
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
    const extraValue = "extras",
      params = {
        id: sourceToken,
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

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should create a card for the provided customer with extra parameters in metadata", () => {
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
          id: sourceToken
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

    after(async () => {
      await customer.delete();
    });

    it("should throw an error saying source ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid source ID.");
    });
  });

  describe("Update all properties that can be updated", () => {
    let source, customer;
    const params = {
      address_city: "City of London",
      address_country: "GB",
      address_line1: "address line 1",
      address_line2: "address line 2",
      address_state: "London",
      address_zip: "NE17",
      exp_month: 10,
      exp_year: 2025,
      extra_1: "extras",
      name: "New Name"
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      await source.save();
      source.set(params);
      await source.save();
    });

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should update properties successfully", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["id", "object", "brand", "customer"], "Invalid stush Source instance");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Customer instance");
      assert.equal(_.get(source, "data.brand", ""), "Visa", "Card brand did not match");
      assert.equal(_.get(source, "data.customer", ""), _.get(customer, "data.id", ""), "Customer did not match");
      assert.equal(_.get(source, "data.address_city", ""), _.get(params, "address_city", ""), "address_city did not match");
      assert.equal(_.get(source, "data.address_country", ""), _.get(params, "address_country", ""), "address_country did not match");
      assert.equal(_.get(source, "data.address_line1", ""), _.get(params, "address_line1", ""), "address_line1 did not match");
      assert.equal(_.get(source, "data.address_line2", ""), _.get(params, "address_line2", ""), "address_line2 did not match");
      assert.equal(_.get(source, "data.address_state", ""), _.get(params, "address_state", ""), "address_state did not match");
      assert.equal(_.get(source, "data.address_zip", ""), _.get(params, "address_zip", ""), "address_zip did not match");
      assert.equal(_.get(source, "data.exp_month", ""), _.get(params, "exp_month", ""), "exp_month did not match");
      assert.equal(_.get(source, "data.exp_year", ""), _.get(params, "exp_year", ""), "exp_year did not match");
      assert.equal(_.get(source, "data.name", ""), _.get(params, "name", ""), "name did not match");
      assert.equal(_.get(source, "data.metadata.extra_1", ""), _.get(params, "extra_1", ""), "extra_1 did not match");
      assert.match(_.get(source, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
    });
  });

  describe("Update properties that can't be updated", () => {
    let source, customer;
    const params = {
      brand: "MasterCard",
      object: "bank_account",
      country: "IN",
      dynamic_last4: "0000",
      fingerprint: "gibberish",
      funding: "unknown",
      last4: "0000",
      tokenization_method: "android_pay"
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      await source.save();
      source.set(params);
      await source.save();
    });

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should not update the properties", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["id", "object", "brand", "customer"], "Invalid stush Source instance");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Customer instance");
      assert.equal(_.get(source, "data.customer", ""), _.get(customer, "data.id", ""), "Customer did not match");
      assert.notEqual(_.get(source, "data.brand", ""), _.get(params, "brand", ""), "Card brand updated");
      assert.notEqual(_.get(source, "data.object", ""), _.get(params, "object", ""), "object updated");
      assert.notEqual(_.get(source, "data.country", ""), _.get(params, "country", ""), "country updated");
      assert.notEqual(_.get(source, "data.dynamic_last4", ""), _.get(params, "dynamic_last4", ""), "dynamic_last4 updated");
      assert.notEqual(_.get(source, "data.fingerprint", ""), _.get(params, "fingerprint", ""), "fingerprint updated");
      assert.notEqual(_.get(source, "data.funding", ""), _.get(params, "funding", ""), "funding updated");
      assert.notEqual(_.get(source, "data.last4", ""), _.get(params, "last4", ""), "last4 updated");
      assert.notEqual(_.get(source, "data.tokenization_method", ""), _.get(params, "tokenization_method", ""), "tokenization_method updated");
      assert.match(_.get(source, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
    });
  });

  describe("Update a mix of properties that can be updated, and that can't be updated", () => {
    let source, customer;
    const params = {
      brand: "MasterCard",
      object: "bank_account",
      country: "IN",
      dynamic_last4: "0000",
      fingerprint: "gibberish",
      funding: "unknown",
      last4: "0000",
      tokenization_method: "android_pay",
      address_city: "City of London",
      address_country: "GB",
      address_line1: "address line 1",
      address_line2: "address line 2",
      address_state: "London",
      address_zip: "NE17",
      exp_month: 10,
      exp_year: 2025,
      extra_1: "extras",
      name: "New Name"
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      await source.save();
      source.set(params);
      await source.save();
    });

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should only update the properties that can be updated, and ignore the ones that can't be updated", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["id", "object", "brand", "customer"], "Invalid stush Source instance");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Customer instance");
      assert.equal(_.get(source, "data.customer", ""), _.get(customer, "data.id", ""), "Customer did not match");
      assert.notEqual(_.get(source, "data.brand", ""), _.get(params, "brand", ""), "Card brand updated");
      assert.notEqual(_.get(source, "data.object", ""), _.get(params, "object", ""), "object updated");
      assert.notEqual(_.get(source, "data.country", ""), _.get(params, "country", ""), "country updated");
      assert.notEqual(_.get(source, "data.dynamic_last4", ""), _.get(params, "dynamic_last4", ""), "dynamic_last4 updated");
      assert.notEqual(_.get(source, "data.fingerprint", ""), _.get(params, "fingerprint", ""), "fingerprint updated");
      assert.notEqual(_.get(source, "data.funding", ""), _.get(params, "funding", ""), "funding updated");
      assert.notEqual(_.get(source, "data.last4", ""), _.get(params, "last4", ""), "last4 updated");
      assert.notEqual(_.get(source, "data.tokenization_method", ""), _.get(params, "tokenization_method", ""), "tokenization_method updated");
      assert.equal(_.get(source, "data.address_city", ""), _.get(params, "address_city", ""), "address_city did not match");
      assert.equal(_.get(source, "data.address_country", ""), _.get(params, "address_country", ""), "address_country did not match");
      assert.equal(_.get(source, "data.address_line1", ""), _.get(params, "address_line1", ""), "address_line1 did not match");
      assert.equal(_.get(source, "data.address_line2", ""), _.get(params, "address_line2", ""), "address_line2 did not match");
      assert.equal(_.get(source, "data.address_state", ""), _.get(params, "address_state", ""), "address_state did not match");
      assert.equal(_.get(source, "data.address_zip", ""), _.get(params, "address_zip", ""), "address_zip did not match");
      assert.equal(_.get(source, "data.exp_month", ""), _.get(params, "exp_month", ""), "exp_month did not match");
      assert.equal(_.get(source, "data.exp_year", ""), _.get(params, "exp_year", ""), "exp_year did not match");
      assert.equal(_.get(source, "data.name", ""), _.get(params, "name", ""), "name did not match");
      assert.equal(_.get(source, "data.metadata.extra_1", ""), _.get(params, "extra_1", ""), "extra_1 did not match");
      assert.match(_.get(source, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
    });
  });

  describe("Delete a card", () => {
    let customer, source, createdSource;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      createdSource = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      await createdSource.save();
      source = createdSource.clone();
      await source.delete();
    });

    after(async () => {
      await customer.delete();
    });

    it("should contain a property \"deleted\" with value true (implies deleted)", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["deleted", "id"], "Invalid stush Source instance");
      assert.equal(_.get(source, "data.id", ""), _.get(createdSource, "data.id", ""), "card id did not match");
      assert.isTrue(_.get(source, "data.deleted", ""), "Card was not deleted");
    });
  });

  describe("Delete a card without customer id", () => {
    let customer, source, createdSource, err;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        createdSource = new Source(stush, {
          id: sourceToken,
          customer: _.get(customer, "data.id", "")
        });
        await createdSource.save();
        source = new Source(stush, {
          id: _.get(createdSource, "data.id", "")
        });
        await source.delete();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await createdSource.delete();
      await customer.delete();
    });

    it("should throw an error saying customer ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid customer ID.");
    });
  });

  describe("Delete a card without card id", () => {
    let customer, source, err;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        source = new Source(stush, {
          customer: _.get(customer, "data.id", "")
        });
        await source.delete();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await customer.delete();
    });

    it("should throw an error saying source ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid source ID.");
    });
  });

  describe("Delete a card with invalid card id", () => {
    let customer, source, err, originalId;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        source = new Source(stush, {
          id: sourceToken,
          customer: _.get(customer, "data.id", "")
        });
        await source.save();
        originalId = _.get(source, "data.id", "");  // For cleaning up after test
        source.set({id: "gibberish"});
        await source.delete();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      source.set({id: originalId});
      await source.delete();
      await customer.delete();
    });

    it("should throw an error saying source ID should be valid", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid source ID.");
    });
  });

  describe("Self populate a Source (card) instance", () => {
    let customer, source, createdSource;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      createdSource = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      await createdSource.save();
      source = new Source(stush, {
        id: _.get(createdSource, "data.id", ""),
        customer: _.get(customer, "data.id", "")
      });
      await source.selfPopulate();
    });

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should contain properties that imply source object is populated from Stripe", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, ["id", "customer", "object"], "Invalid stush Source instance");
      assert.containsAllKeys(source.data, [
        "brand", "country", "dynamic_last4", "exp_month", "exp_year", "fingerprint",
        "funding", "last4", "name", "tokenization_method", "address_city", "address_country",
        "address_line1", "address_line2", "address_state", "address_zip"
      ], "Doesn't contain all fields that populate from Stripe");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Source (card) instance");
      assert.equal(_.get(source, "data.id", ""), _.get(createdSource, "data.id", ""), "customer id did not match");
    });
  });

  describe("Self populate a Source (card) instance without customer ID", () => {
    let customer, source, createdSource, err;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        createdSource = new Source(stush, {
          id: sourceToken,
          customer: _.get(customer, "data.id", "")
        });
        await createdSource.save();
        source = new Source(stush, {
          id: _.get(createdSource, "data.id", "")
        });
        await source.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await createdSource.delete();
      await customer.delete();
    });

    it("should throw an error saying customer ID is required for populating card", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid customer ID before self populating card or bank account");
    });
  });

  describe("Self populate a Source (card) instance without card ID", () => {
    let customer, source, createdSource, err;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        createdSource = new Source(stush, {
          id: sourceToken,
          customer: _.get(customer, "data.id", "")
        });
        await createdSource.save();
        source = new Source(stush, {
          customer: _.get(customer, "data.id", "")
        });
        await source.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await createdSource.delete();
      await customer.delete();
    });

    it("should throw an error saying source ID is required for populating card", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid source ID before self populating");
    });
  });

  describe("Self populate a Source (card) instance with invalid card ID", () => {
    let customer, source, createdSource, err;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        createdSource = new Source(stush, {
          id: sourceToken,
          customer: _.get(customer, "data.id", "")
        });
        await createdSource.save();
        source = new Source(stush, {
          id: "gibberish"
        });
        await source.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await createdSource.delete();
      await customer.delete();
    });

    it("should throw an error saying Source ID is invalid", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Invalid source ID provided");
    });
  });

  describe("Test utility methods on Coupon class", () => {
    let customer, source, json;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      await source.save();
      json = source.toJson();
    });

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should return correct json of Source instance", () => {
      // Assertions
      assert.containsAllKeys(source, ["data"], "Invalid Stush Source instance");
      assert.containsAllKeys(source.data, ["id", "object"], "Invalid Stush Source instance");
      assert.match(_.get(source, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
      assert.equal(_.get(source, "data.object", ""), "card", "Invalid stush Source object type");
      assert.deepEqual(json, _.get(source, "data", ""), "source.toJson() failed");
    });
  });

});