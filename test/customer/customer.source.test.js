import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Source from "../../src/source/source";
import Customer from "../../src/customer/customer";

const assert = chai.assert;
const should = chai.should();

const email = "customer-source@atyantik.com";
const sourceToken = "tok_visa";

if (!process.env.npm_config_SECRET_KEY && !process.env.SECRET_KEY) {
  console.error("\nPlease provide Stripe secret key for tests (npm --SECRET_KEY=YOUR_KEY test or set as env variable).\n\n");
  process.exit();
}

const stush = new Stush({
  secret: process.env.npm_config_SECRET_KEY ? process.env.npm_config_SECRET_KEY : process.env.SECRET_KEY,
  subscription_model: "single"
});

describe("Customer - Source", () => {
  // Tests for all Source operations from Customer instance

  describe("Attach a source using token", () => {
    let customer, attachedSource;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      attachedSource = await customer.attachSource(sourceToken);
    });

    after(async () => {
      await attachedSource.delete();
      await customer.delete();
    });

    it("should attach a new source to customer", () => {
      // Assertions
      assert.containsAllKeys(attachedSource, ["data"], "Invalid source instance");
      assert.containsAllKeys(attachedSource.data, ["id", "object", "customer"], "Invalid source instance");
      assert.match(_.get(attachedSource, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
      assert.equal(_.get(attachedSource, "data.object", ""), "card", "Invalid source object type");
      assert.equal(_.get(attachedSource, "data.customer", ""), _.get(customer, "data.id", ""), "Source not attached");
    });
  });

  describe("Attach a source using Source instance", () => {
    let customer, source, attachedSource;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source = new Source(stush, {
        id: sourceToken,
        customer: _.get(customer, "data.id", "")
      });
      attachedSource = await customer.attachSource(source);
    });

    after(async () => {
      await attachedSource.delete();
      await customer.delete();
    });

    it("should attach a new source to customer", () => {
      // Assertions
      assert.containsAllKeys(attachedSource, ["data"], "Invalid source instance");
      assert.containsAllKeys(attachedSource.data, ["id", "object", "customer"], "Invalid source instance");
      assert.match(_.get(attachedSource, "data.id", ""), /^card_.+$/, "Invalid Stripe card ID");
      assert.equal(_.get(attachedSource, "data.object", ""), "card", "Invalid source object type");
      assert.equal(_.get(attachedSource, "data.customer", ""), _.get(customer, "data.id", ""), "Source not attached");
    });
  });

  describe("Attach a source using invalid source datatype", () => {
    let customer, err;

    before(async () => {
      try {
        let srcToken = 458695485;
        customer = new Customer(stush, {
          email: email
        });
        await customer.save();
        await customer.attachSource(srcToken);
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await customer.delete();
    });

    it("should throw an error asking for valid source ID", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid source ID or Source instance to attach.");
    });
  });

  describe("Attach a non-attachable source instance", () => {
    let customer, source, err;

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
        await customer.attachSource(source);
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await source.delete();
      await customer.delete();
    });

    it("should throw an error asking for valid source ID", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid source ID.");
    });
  });

  describe("Detach a card using id", () => {
    let customer, attachedSource, detachedSource;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      attachedSource = await customer.attachSource(sourceToken);
      detachedSource = await customer.detachSource(_.get(attachedSource, "data.id", ""));
    });

    after(async () => {
      await customer.delete();
    });

    it("should detach the card succesfully", () => {
      // Assertions
      assert.containsAllKeys(detachedSource, ["data"], "Invalid source instance");
      assert.containsAllKeys(detachedSource.data, ["id", "deleted"], "Invalid source instance");
      assert.equal(_.get(detachedSource, "data.id", ""), _.get(attachedSource, "data.id", ""), "Invalid Stripe card ID");
      assert.isTrue(_.get(detachedSource, "data.deleted", ""), "Card was not detached and deleted.");
    });
  });

  describe("Detach a card using source instance", () => {
    let customer, attachedSource, detachedSource;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      attachedSource = await customer.attachSource(sourceToken);
      detachedSource = await customer.detachSource(attachedSource);
    });

    after(async () => {
      await customer.delete();
    });

    it("should detach the card succesfully", () => {
      // Assertions
      assert.containsAllKeys(detachedSource, ["data"], "Invalid source instance");
      assert.containsAllKeys(detachedSource.data, ["id", "deleted"], "Invalid source instance");
      assert.equal(_.get(detachedSource, "data.id", ""), _.get(attachedSource, "data.id", ""), "Invalid Stripe card ID");
      assert.isTrue(_.get(detachedSource, "data.deleted", ""), "Card was not detached and deleted.");
    });
  });

  describe("Update a card", () => {
    let customer, attachedSource, updatedSource;
    const params = {
      address_city: "City of London",
      address_country: "GB",
      address_line1: "address line 1",
      address_line2: "address line 2",
      address_state: "London",
      address_zip: "NE17",
      exp_month: 10,
      exp_year: 2025,
    };

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      attachedSource = await customer.attachSource(sourceToken);
      updatedSource = await customer.updateSource(_.get(attachedSource, "data.id", ""), params);
    });

    after(async () => {
      await customer.delete();
    });

    it("should detach the card succesfully", () => {
      // Assertions
      assert.containsAllKeys(updatedSource, ["data"], "Invalid source instance");
      assert.containsAllKeys(updatedSource.data, ["id", "object", "customer"], "Invalid source instance");
      assert.equal(_.get(updatedSource, "data.id", ""), _.get(attachedSource, "data.id", ""), "Invalid Stripe card ID");
      assert.equal(_.get(updatedSource, "data.customer", ""), _.get(customer, "data.id", ""), "customer ID did not match");
      assert.equal(_.get(updatedSource, "data.address_city", ""), _.get(params, "address_city", ""), "address_city did not match");
      assert.equal(_.get(updatedSource, "data.address_country", ""), _.get(params, "address_country", ""), "address_country did not match");
      assert.equal(_.get(updatedSource, "data.address_line1", ""), _.get(params, "address_line1", ""), "address_line1 did not match");
      assert.equal(_.get(updatedSource, "data.address_line2", ""), _.get(params, "address_line2", ""), "address_line2 did not match");
      assert.equal(_.get(updatedSource, "data.address_state", ""), _.get(params, "address_state", ""), "address_state did not match");
      assert.equal(_.get(updatedSource, "data.address_zip", ""), _.get(params, "address_zip", ""), "address_zip did not match");
      assert.equal(_.get(updatedSource, "data.exp_month", ""), _.get(params, "exp_month", ""), "exp_month did not match");
      assert.equal(_.get(updatedSource, "data.exp_year", ""), _.get(params, "exp_year", ""), "exp_year did not match");
    });
  });

  describe("Fetch all sources of a customer", () => {
    let customer, source1, source2, sources;

    before(async () => {
      customer = new Customer(stush, {
        email: email
      });
      await customer.save();
      source1 = await customer.attachSource(sourceToken);
      source2 = await customer.attachSource("tok_amex");
      sources = await customer.fetchAllSources();
    });

    after(async () => {
      await source2.delete();
      await source1.delete();
      await customer.delete();
    });

    it("should detach the card succesfully", () => {
      // Assertions
      assert.isAtLeast(sources.length, 2, "Number of sources fetched is incorrect");
      assert.includeDeepMembers(sources, [source1, source2], "Did not fetch all sources");
    });
  });

  describe("Fetch all sources of an unknown customer (no customer ID)", () => {
    let customer, err, sources;

    before(async () => {
      try {
        customer = new Customer(stush, {
          email: email
        });
        sources = await customer.fetchAllSources();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying customer ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid customer ID to fetch sources.");
      assert.isUndefined(sources, "sources were fetched");
    });
  });

});