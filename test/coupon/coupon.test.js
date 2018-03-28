import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Coupon from "../../src/coupon/coupon";

const assert = chai.assert;
const should = chai.should();

// Coupon code to be used for tests.
const code = "FREEFUND";

if (!process.env.npm_config_SECRET_KEY && !process.env.SECRET_KEY) {
  console.error("\nPlease provide Stripe secret key for tests (npm --SECRET_KEY=YOUR_KEY test or set as env variable).\n\n");
  process.exit();
}

const stush = new Stush({
  secret: process.env.npm_config_SECRET_KEY ? process.env.npm_config_SECRET_KEY : process.env.SECRET_KEY,
  subscription_model: "single"
});

describe("Coupon", () => {

  describe("Create fixed amount off coupon with minimal parameters", () => {
    let coupon;
    const params = {
      id: code,
      duration: "once",
      amount_off: 1000,
      currency: "usd"
    };

    before(async () => {
      coupon = new Coupon(stush, params);
      await coupon.save();
    });

    after(async () => {
      await coupon.delete();
    });

    it("should successfully create a fixed amount off coupon", () => {
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(
        coupon.data,
        ["id", "object", "livemode", "created", "max_redemptions", "times_redeemed", "valid"],
        "Invalid stush Source instance"
      );
      assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
      assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
      assert.equal(_.get(coupon, "data.amount_off", ""), _.get(params, "amount_off", ""), "amount_off did not match");
      assert.equal(_.get(coupon, "data.currency", ""), _.get(params, "currency", ""), "currency did not match");
      assert.equal(_.get(coupon, "data.duration", ""), _.get(params, "duration", ""), "duration did not match");
      assert.isNull(_.get(coupon, "data.percent_off", ""), "percent_off is not null");
    });
  });

  describe("Create percent off coupon with minimal parameters", () => {
    let coupon;
    const params = {
      id: code,
      duration: "once",
      percent_off: 10
    };

    before(async () => {
      coupon = new Coupon(stush, params);
      await coupon.save();
    });

    after(async () => {
      await coupon.delete();
    });

    it("should successfully create a percent off coupon", () => {
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Source instance");
      assert.containsAllKeys(
        coupon.data,
        ["id", "object", "livemode", "created", "max_redemptions", "times_redeemed", "valid"],
        "Invalid stush Source instance"
      );
      assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
      assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
      assert.equal(_.get(coupon, "data.percent_off", ""), _.get(params, "percent_off", ""), "percent_off did not match");
      assert.equal(_.get(coupon, "data.duration", ""), _.get(params, "duration", ""), "duration did not match");
      assert.isNull(_.get(coupon, "data.amount_off", ""), "amount_off is not null");
    });
  });

  describe("Create coupon without duration", () => {
    let coupon, err;
    const params = {
      id: code,
      percent_off: 10
    };

    before(async () => {
      try {
        coupon = new Coupon(stush, params);
        await coupon.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying duration is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("child \"duration\" fails because [\"duration\" is required]");
    });
  });

  describe("Create coupon without amount_off and percent_off", () => {
    let coupon, err;
    const params = {
      id: code,
      duration: "once"
    };

    before(async () => {
      try {
        coupon = new Coupon(stush, params);
        await coupon.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying either amount_off or percent_off is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("\"value\" must contain at least one of [amount_off, percent_off]");
    });
  });

  describe("Create coupon with duration=\"repeating\", but without duration_in_months", () => {
    let coupon, err;
    const params = {
      id: code,
      duration: "repeating",
      percent_off: 10
    };

    before(async () => {
      try {
        coupon = new Coupon(stush, params);
        await coupon.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying duration_in_months is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("child \"duration_in_months\" fails because [\"duration_in_months\" is required]");
    });
  });

  describe("Create coupon with amount_off, but without currency", () => {
    let coupon, err;
    const params = {
      id: code,
      duration: "once",
      amount_off: 10
    };

    before(async () => {
      try {
        coupon = new Coupon(stush, params);
        await coupon.save();
      }
      catch (_err) {
        err = _err;
      }
    });

    it("should throw an error saying currency is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("child \"currency\" fails because [\"currency\" is required]");
    });
  });

  describe("Create coupon with extra unknown properties", () => {
    let coupon;
    const extraValue = "extras",
      params = {
        id: code,
        duration: "once",
        percent_off: 10,
        extra_1: extraValue,
        extra_2: extraValue,
        extra_3: extraValue
      };

    before(async () => {
      coupon = new Coupon(stush, params);
      await coupon.save();
    });

    after(async () => {
      await coupon.delete();
    });

    it("should successfully create a coupon with extra properties in metadata", () => {
      // Assertions
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data, ["id", "object", "metadata", "created"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data.metadata, ["extra_1", "extra_2", "extra_3"], "Invalid stush Coupon instance");
      assert.equal(_.get(coupon,  "data.id", ""), code, "Invalid coupon code");
      assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
      assert.equal(_.get(coupon, "data.metadata.extra_1", ""), extraValue, "Extra 1 metadata did not match");
      assert.equal(_.get(coupon, "data.metadata.extra_2", ""), extraValue, "Extra 2 metadata did not match");
      assert.equal(_.get(coupon, "data.metadata.extra_3", ""), extraValue, "Extra 3 metadata did not match");
    });
  });

  describe("Update all properties that can be updated (metadata)", () => {
    let coupon, createdCoupon;
    const extraValue = "extras",
      params = {
        extra_1: extraValue,
        extra_2: extraValue,
        extra_3: extraValue
      };

    before(async () => {
      createdCoupon = new Coupon(stush, {
        id: code,
        duration: "once",
        percent_off: 10
      });
      await createdCoupon.save();
      coupon = createdCoupon.clone();
      coupon.set(params, true);
      await coupon.save();
    });

    after(async () => {
      await createdCoupon.delete();
    });

    it("should successfully update metadata", () => {
      // Assertions
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data, ["id", "object", "metadata", "created"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data.metadata, ["extra_1", "extra_2", "extra_3"], "Invalid stush Coupon instance");
      assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
      assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
      assert.equal(_.get(coupon, "data.metadata.extra_1", ""), extraValue, "Extra 1 metadata did not match");
      assert.equal(_.get(coupon, "data.metadata.extra_2", ""), extraValue, "Extra 2 metadata did not match");
      assert.equal(_.get(coupon, "data.metadata.extra_3", ""), extraValue, "Extra 3 metadata did not match");
    });
  });

  describe("Update properties that cannot be updated", () => {
    let coupon, createdCoupon;
    const params = {
      amount_off: 5000,
      currency: "gbp",
      duration: "forever",
      redeem_by: new Date().getTime(),
    };

    before(async () => {
      createdCoupon = new Coupon(stush, {
        id: code,
        duration: "once",
        amount_off: 1000,
        currency: "usd"
      });
      await createdCoupon.save();
      coupon = createdCoupon.clone();
      coupon.set(params, true);
      await coupon.save();
    });

    after(async () => {
      await createdCoupon.delete();
    });

    it("should not update properties that cannot be updated", () => {
      // Assertions
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data, ["id", "object", "created"], "Invalid stush Coupon instance");
      assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
      assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
      assert.notEqual(_.get(coupon, "data.duration", ""), _.get(params, "duration", ""), "Duration updated");
      assert.notEqual(_.get(coupon, "data.amount_off", ""), _.get(params, "amount_off", ""), "amount_off updated");
      assert.notEqual(_.get(coupon, "data.currency", ""), _.get(params, "currency", ""), "currency updated");
      assert.notEqual(_.get(coupon, "data.redeem_by", ""), _.get(params, "redeem_by", ""), "redeem_by updated");
    });
  });

  describe("Update a mix of properties that can be updated, and that can't be updated", () => {
    let coupon, createdCoupon;
    const extraValue = "extras",
      params = {
        amount_off: 5000,
        currency: "gbp",
        duration: "forever",
        redeem_by: new Date().getTime(),
        extra_1: extraValue,
        extra_2: extraValue,
        extra_3: extraValue
      };

    before(async () => {
      createdCoupon = new Coupon(stush, {
        id: code,
        duration: "once",
        amount_off: 1000,
        currency: "usd"
      });
      await createdCoupon.save();
      coupon = createdCoupon.clone();
      coupon.set(params, true);
      await coupon.save();
    });

    after(async () => {
      await createdCoupon.delete();
    });

    it("should only update the properties that can be updated, and ignore the ones that can't be updated", () => {
      // Assertions
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data, ["id", "object", "created"], "Invalid stush Coupon instance");
      assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
      assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
      assert.notEqual(_.get(coupon, "data.duration", ""), _.get(params, "duration", ""), "Duration updated");
      assert.notEqual(_.get(coupon, "data.amount_off", ""), _.get(params, "amount_off", ""), "amount_off updated");
      assert.notEqual(_.get(coupon, "data.currency", ""), _.get(params, "currency", ""), "currency updated");
      assert.notEqual(_.get(coupon, "data.redeem_by", ""), _.get(params, "redeem_by", ""), "redeem_by updated");
      assert.equal(_.get(coupon, "data.metadata.extra_1", ""), extraValue, "Extra 1 metadata did not match");
      assert.equal(_.get(coupon, "data.metadata.extra_2", ""), extraValue, "Extra 2 metadata did not match");
      assert.equal(_.get(coupon, "data.metadata.extra_3", ""), extraValue, "Extra 3 metadata did not match");
    });
  });

  describe("Delete a coupon", () => {
    let coupon;

    before(async () => {
      coupon = new Coupon(stush, {
        id: code,
        duration: "once",
        amount_off: 1000,
        currency: "usd"
      });
      await coupon.save();
      await coupon.delete();
    });

    it("should contain a property \"deleted\" with value true (implies deleted)", () => {
      // Assertions
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data, ["id", "deleted"], "Invalid stush deleted Coupon instance");
      assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
      assert.isTrue(_.get(coupon, "data.deleted", ""), "coupon", "Invalid stush Coupon instance");
    });
  });

  describe("Delete a coupon without id", () => {
    let coupon, createdCoupon, err;

    before(async () => {
      try {
        createdCoupon = new Coupon(stush, {
          id: code,
          duration: "once",
          amount_off: 1000,
          currency: "usd"
        });
        await createdCoupon.save();
        coupon = await createdCoupon.clone();
        _.unset(coupon.data, "id");
        await coupon.delete();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await createdCoupon.delete();
    });

    it("should throw an error saying coupon ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid coupon ID to delete.");
    });
  });

  describe("Self populate a coupon", () => {
    let coupon, createdCoupon;

    before(async () => {
      createdCoupon = new Coupon(stush, {
        id: code,
        duration: "once",
        amount_off: 1000,
        currency: "usd"
      });
      await createdCoupon.save();
      coupon = new Coupon(stush, {
        id: _.get(createdCoupon, "data.id", "")
      });
      await coupon.selfPopulate();
    });

    after(async () => {
      await createdCoupon.delete();
    });

    it("should contain properties that imply source object is populated from Stripe", () => {
      // Assertions
      assert.containsAllKeys(coupon, ["data"], "Invalid stush Coupon instance");
      assert.containsAllKeys(coupon.data, ["id", "object"], "Invalid stush deleted Coupon instance");
      assert.containsAllKeys(coupon.data, ["created", "livemode", "max_redemptions", "times_redeemed", "valid"],
        "Invalid stush deleted Coupon instance");
      assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
      assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
    });
  });

  describe("Self populate a coupon without id", () => {
    let coupon, createdCoupon, err;

    before(async () => {
      try {
        createdCoupon = new Coupon(stush, {
          id: code,
          duration: "once",
          amount_off: 1000,
          currency: "usd"
        });
        await createdCoupon.save();
        coupon = new Coupon(stush, {});
        await coupon.selfPopulate();
      }
      catch (_err) {
        err = _err;
      }
    });

    after(async () => {
      await createdCoupon.delete();
    });

    it("should throw an error saying coupon ID is required", () => {
      // Assertions
      should.exist(err);
      err.should.be.an.instanceOf(Error);
      err.message.should.equal("Please provide a valid coupon ID to self populate.");
    });
  });

});