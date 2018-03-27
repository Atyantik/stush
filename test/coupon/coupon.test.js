import chai from "chai";
import _ from "lodash";
import Stush from "../../src/stush/stush";
import Coupon from "../../src/coupon/coupon";

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

describe("Coupon", () => {

  // describe("Create fixed amount off coupon with minimal parameters", () => {
  //   let coupon;
  //   const code = "FREEFUND",
  //     params = {
  //       id: code,
  //       duration: "once",
  //       amount_off: 1000,
  //       currency: "usd"
  //     };
  //
  //   before(async () => {
  //     coupon = new Coupon(stush, params);
  //     await coupon.save();
  //   });
  //
  //   after(async () => {
  //     await coupon.delete();
  //   });
  //
  //   it("should successfully create a fixed amount off coupon", () => {
  //     assert.containsAllKeys(coupon, ["data"], "Invalid stush Source instance");
  //     assert.containsAllKeys(
  //       coupon.data,
  //       ["id", "object", "livemode", "created", "max_redemptions", "times_redeemed", "valid"],
  //       "Invalid stush Source instance"
  //     );
  //     assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
  //     assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
  //     assert.equal(_.get(coupon, "data.amount_off", ""), _.get(params, "amount_off", ""), "amount_off did not match");
  //     assert.equal(_.get(coupon, "data.currency", ""), _.get(params, "currency", ""), "currency did not match");
  //     assert.equal(_.get(coupon, "data.duration", ""), _.get(params, "duration", ""), "duration did not match");
  //     assert.isNull(_.get(coupon, "data.percent_off", ""), "percent_off is not null");
  //   });
  // });

  describe("Create percent off coupon with minimal parameters", () => {
    let coupon;
    const code = "FREEFUND",
      params = {
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

    it("should successfully create a fixed amount off coupon", () => {
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

});