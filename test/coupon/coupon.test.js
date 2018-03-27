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

  // describe("Create fixed amount off coupon with minimal parameters", () => {
  //   let coupon;
  //   const params = {
  //     id: code,
  //     duration: "once",
  //     amount_off: 1000,
  //     currency: "usd"
  //   };
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
  //
  // describe("Create percent off coupon with minimal parameters", () => {
  //   let coupon;
  //   const params = {
  //     id: code,
  //     duration: "once",
  //     percent_off: 10
  //   };
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
  //   it("should successfully create a percent off coupon", () => {
  //     assert.containsAllKeys(coupon, ["data"], "Invalid stush Source instance");
  //     assert.containsAllKeys(
  //       coupon.data,
  //       ["id", "object", "livemode", "created", "max_redemptions", "times_redeemed", "valid"],
  //       "Invalid stush Source instance"
  //     );
  //     assert.equal(_.get(coupon, "data.id", ""), code, "Invalid coupon code");
  //     assert.equal(_.get(coupon, "data.object", ""), "coupon", "Invalid stush Coupon instance");
  //     assert.equal(_.get(coupon, "data.percent_off", ""), _.get(params, "percent_off", ""), "percent_off did not match");
  //     assert.equal(_.get(coupon, "data.duration", ""), _.get(params, "duration", ""), "duration did not match");
  //     assert.isNull(_.get(coupon, "data.amount_off", ""), "amount_off is not null");
  //   });
  // });
  //
  // describe("Create coupon without duration", () => {
  //   let coupon, err;
  //   const params = {
  //     id: code,
  //     percent_off: 10
  //   };
  //
  //   before(async () => {
  //     try {
  //       coupon = new Coupon(stush, params);
  //       await coupon.save();
  //     }
  //     catch (_err) {
  //       err = _err;
  //     }
  //   });
  //
  //   it("should throw an error saying duration is required", () => {
  //     // Assertions
  //     should.exist(err);
  //     err.should.be.an.instanceOf(Error);
  //     err.message.should.equal("child \"duration\" fails because [\"duration\" is required]");
  //   });
  // });
  //
  // describe("Create coupon without amount_off and percent_off", () => {
  //   let coupon, err;
  //   const params = {
  //     id: code,
  //     duration: "once"
  //   };
  //
  //   before(async () => {
  //     try {
  //       coupon = new Coupon(stush, params);
  //       await coupon.save();
  //     }
  //     catch (_err) {
  //       err = _err;
  //     }
  //   });
  //
  //   it("should throw an error saying either amount_off or percent_off is required", () => {
  //     // Assertions
  //     should.exist(err);
  //     err.should.be.an.instanceOf(Error);
  //     err.message.should.equal("\"value\" must contain at least one of [amount_off, percent_off]");
  //   });
  // });
  //
  // describe("Create coupon with duration=\"repeating\", but without duration_in_months", () => {
  //   let coupon, err;
  //   const params = {
  //     id: code,
  //     duration: "repeating",
  //     percent_off: 10
  //   };
  //
  //   before(async () => {
  //     try {
  //       coupon = new Coupon(stush, params);
  //       await coupon.save();
  //     }
  //     catch (_err) {
  //       err = _err;
  //     }
  //   });
  //
  //   it("should throw an error saying duration_in_months is required", () => {
  //     // Assertions
  //     should.exist(err);
  //     err.should.be.an.instanceOf(Error);
  //     err.message.should.equal("child \"duration_in_months\" fails because [\"duration_in_months\" is required]");
  //   });
  // });

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

});