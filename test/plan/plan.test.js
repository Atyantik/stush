/**
 * Created by ravindra on 28/3/18.
 */
import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Plan from "../../src/plan/plan";

const assert = chai.assert;
const should = chai.should();

// Coupon code to be used for tests.
const planId = "premium";

if (!process.env.npm_config_SECRET_KEY && !process.env.SECRET_KEY) {
  console.error("\nPlease provide Stripe secret key for tests (npm --SECRET_KEY=YOUR_KEY test or set as env variable).\n\n");
  process.exit();
}

const stush = new Stush({
  secret: process.env.npm_config_SECRET_KEY ? process.env.npm_config_SECRET_KEY : process.env.SECRET_KEY,
  subscription_model: "single"
});

describe("Plan", () => {

  describe("Create a plan with minimal required parameters", () => {
    let plan;
    const params = {
      id: planId,
      price: 50,
      currency: "usd",
      bill_every: "month",
      name: "Premium"
    };

    before(async () => {
      plan = new Plan(stush, params);
      await plan.save();
    });

    after(async () => {
      await plan.delete();
    });

    it("should successfully create a new plan", () => {
      // Assertions
      assert.containsAllKeys(plan, ["data"], "Invalid stush Plan instance");
      assert.containsAllKeys(plan.data, ["id", "object", "created", "interval", "interval_count"], "Invalid stush Plan instance");
      assert.equal(_.get(plan, "data.id", ""), planId, "Plan id did not match");
      assert.equal(_.get(plan, "data.object", ""), "plan", "Object id did not match");
      assert.equal(_.get(plan, "data.price", ""), _.get(params, "amount", "")*100, "Price id did not match");
      assert.equal(_.get(plan, "data.name", ""), _.get(params, "name", ""), "name id did not match");
    });
  });

  describe("Create a plan with extra unknown parameters", () => {
    let plan;
    const params = {
      id: planId,
      price: 50,
      currency: "usd",
      bill_every: "week",
      name: "Premium",
      extra_1: "extras"
    };

    before(async () => {
      plan = new Plan(stush, params);
      await plan.save();
    });

    after(async () => {
      await plan.delete();
    });

    it("should successfully create a new plan with extra properties in metadata", () => {
      // Assertions
      assert.containsAllKeys(plan, ["data"], "Invalid stush Plan instance");
      assert.containsAllKeys(plan.data, ["id", "object", "created", "interval", "interval_count"], "Invalid stush Plan instance");
      assert.equal(_.get(plan, "data.id", ""), planId, "Plan id did not match");
      assert.equal(_.get(plan, "data.object", ""), "plan", "Object id did not match");
      assert.equal(_.get(plan, "data.price", ""), _.get(params, "amount", "")*100, "Price id did not match");
      assert.equal(_.get(plan, "data.name", ""), _.get(params, "name", ""), "name id did not match");
      assert.equal(_.get(plan, "data.metadata.extra_1", ""), _.get(params, "extra_1", ""), "name id did not match");
    });
  });

  describe("Update all properties that can be updated", () => {
    let plan;
    const extraValue = "extras",
      params = {
        extra_1: extraValue,
        extra_2: extraValue,
        extra_3: extraValue
      };

    before(async () => {
      plan = new Plan(stush, {
        id: planId,
        price: 50,
        currency: "usd",
        bill_every: "3 days",
        name: "Premium"
      });
      await plan.save();
      plan.set(params, true);
      await plan.save();
    });

    after(async () => {
      await plan.delete();
    });

    it("should successfully update metadata", () => {
      // Assertions
      assert.containsAllKeys(plan, ["data"], "Invalid stush Plan instance");
      assert.containsAllKeys(plan.data, ["id", "object", "created", "interval", "interval_count"], "Invalid stush Plan instance");
      assert.equal(_.get(plan, "data.id", ""), planId, "Plan id did not match");
      assert.equal(_.get(plan, "data.object", ""), "plan", "Object id did not match");
      assert.equal(_.get(plan, "data.metadata.extra_1", ""), _.get(params, "extra_1", ""), "extra_1 id did not match");
      assert.equal(_.get(plan, "data.metadata.extra_2", ""), _.get(params, "extra_2", ""), "extra_2 id did not match");
      assert.equal(_.get(plan, "data.metadata.extra_3", ""), _.get(params, "extra_3", ""), "extra_3 id did not match");
    });
  });

  describe("Update all properties that cannot be updated", () => {
    let plan;
    const params = {
      price: 100,
      currency: "gbp",
      bill_every: "year",
      name: "Premiumista"
    };

    before(async () => {
      plan = new Plan(stush, {
        id: planId,
        price: 50,
        currency: "usd",
        bill_every: "month",
        name: "Premium"
      });
      await plan.save();
      plan.set(params, true);
      await plan.save();
    });

    after(async () => {
      await plan.delete();
    });

    it("should not update properties that cannot be updated", () => {
      // Assertions
      assert.containsAllKeys(plan, ["data"], "Invalid stush Plan instance");
      assert.containsAllKeys(plan.data, ["id", "object", "created", "interval", "interval_count"], "Invalid stush Plan instance");
      assert.equal(_.get(plan, "data.id", ""), planId, "Plan id did not match");
      assert.equal(_.get(plan, "data.object", ""), "plan", "Object id did not match");
      assert.notEqual(_.get(plan, "data.price", ""), _.get(params, "price", ""), "price id did not match");
      assert.notEqual(_.get(plan, "data.currency", ""), _.get(params, "currency", ""), "currency id did not match");
      assert.notEqual(_.get(plan, "data.bill_every", ""), _.get(params, "bill_every", ""), "bill_every id did not match");
      assert.notEqual(_.get(plan, "data.name", ""), _.get(params, "name", ""), "name id did not match");
    });
  });

  describe("Delete a plan", () => {
    let plan, createdPlan;
    const params = {
      id: planId,
      price: 50,
      currency: "usd",
      bill_every: "month",
      name: "Premium"
    };

    before(async () => {
      createdPlan = new Plan(stush, params);
      await createdPlan.save();
      plan = new Plan(stush, {
        id: _.get(createdPlan, "data.id", "")
      });
      await plan.delete();
    });

    it("should contain a property \"deleted\" with value true (implies deleted)", () => {
      // Assertions
      assert.containsAllKeys(plan, ["data"], "Invalid stush Plan instance");
      assert.containsAllKeys(plan.data, ["id", "deleted"], "Invalid stush deleted Plan instance");
      assert.equal(_.get(plan, "data.id", ""), _.get(createdPlan, "data.id", ""), "Invalid plan ID");
      assert.isTrue(_.get(plan, "data.deleted", ""), "Invalid stush Plan instance");
    });
  });

  describe("Delete a plan without plan ID", () => {
    let plan, err;
    const params = {
      price: 50,
      currency: "usd",
      bill_every: "month",
      name: "Premium"
    };

    before(async () => {
      try {
        plan = new Plan(stush, params);
        await plan.delete();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying plan ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid plan ID to delete.");
    });
  });

  describe("Self populate a plan", () => {
    let plan, createdPlan;
    const params = {
      id: planId,
      price: 50,
      currency: "usd",
      bill_every: "month",
      name: "Premium"
    };

    before(async () => {
      createdPlan = new Plan(stush, params);
      await createdPlan.save();
      plan = new Plan(stush, {
        id: _.get(createdPlan, "data.id", "")
      });
      await plan.selfPopulate();
    });

    after(async () => {
      await createdPlan.delete();
    });

    it("should contain properties that imply source object is populated from Stripe", () => {
      // Assertions
      assert.containsAllKeys(plan, ["data"], "Invalid stush Plan instance");
      assert.containsAllKeys(plan.data, ["id", "object", "created", "livemode", "trial_period_days"], "Invalid stush deleted Plan instance");
      assert.equal(_.get(plan, "data.id", ""), _.get(createdPlan, "data.id", ""), "Invalid plan ID");
      assert.equal(_.get(plan, "data.object", ""), "plan", "Invalid stush Plan instance");
      assert.equal(_.get(plan, "data.name", ""), _.get(params, "name", ""), "Invalid stush Plan instance");
    });
  });

  describe("Self populate a plan without plan ID", () => {
    let plan, err;

    before(async () => {
      try {
        plan = new Plan(stush, {});
        await plan.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying plan ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid plan ID before self populating.");
    });
  });

  describe("Create a plan with invalid bill_every value", () => {
    let plan, err;

    before(async () => {
      try {
        plan = new Plan(stush, {
          id: planId,
          price: 5000,
          currency: "usd",
          bill_every: "century",
          name: "Premium"
        });
        await plan.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying invalid bill_every value", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Unable to parse \"bill_every\" value.");
    });
  });

  describe("Test utility methods on Plan class", () => {
    let plan, json, interval, price;

    before(async () => {
      plan = new Plan(stush, {
        id: planId,
        price: 50,
        currency: "usd",
        bill_every: "day",
        name: "Premium"
      });
      await plan.save();
      json = plan.toJson();
      interval = plan.getInterval();
      price = plan.getPrice();
    });

    after(async () => {
      await plan.delete();
    });

    it("should return correct json, interval, and price of Plan instance", () => {
      // Assertions
      assert.containsAllKeys(plan, ["data"], "Invalid Stush Plan instance");
      assert.containsAllKeys(plan.data, ["id", "object", "name", "created"], "Invalid Stush Plan instance");
      assert.equal(_.get(plan, "data.id", ""), planId, "Plan ID did not match");
      assert.equal(_.get(plan, "data.object", ""), "plan", "Invalid stush plan object type");
      assert.deepEqual(json, _.get(plan, "data", ""), "plan.toJson() failed");
      assert.equal(interval, _.get(plan, "data.interval_count", "") + " " + _.get(plan, "data.interval", ""), "plan.getInterval() failed");
      assert.equal(price, _.get(plan, "data.amount", ""), "plan.getPrice() failed");
    });
  });

});