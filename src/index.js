import Stripe from "stripe";
import _ from "lodash";
import Validator from "validations";
import Customer from "./customer/customer";
// import Subscription from "./subscription/subscription";
import generateError from "./handler/error";
import { makeUtilsGlobal } from "./utils";

makeUtilsGlobal();

class Stush {
  userOptions = {};
  constructor(options) {
    this.userOptions = options;
    this.stripe = new Stripe(_.get(this.userOptions, "secret"));
    this.validator = new Validator();
    this.model = _.has(this.userOptions, "model") ? _.get(this.userOptions, "model") : "multiple_subscription";
  }

  async createSubscription(args) {
    let input = this.validator.createSubscriptionInput(args);
    // debug(input); process.exit();
    if (!input.error) {
      try {
        if (_.has(input, "params.customer.id")) {
          // create subscription for provided customer.
          let customer = new Customer(this, _.get(input, "params.customer"));
          // await customer.selfPopulate();
          customer.set({account_balance: 0, metadata: {a: 3, b:1, c:2}});
          await customer.save();
          debug("Existing customer in index: ", customer.toJson());
          await customer.addSubscription(_.get(input, "params.subscription"));
        }
        else {
          // create new customer and a subscription.
          let customer = new Customer(this, _.get(input, "params.customer"));
          await customer.save();
          debug("New customer in index: ", customer.toJson());
        }

        // let customer = new Customer(this, {id: "cus_Bob0KkpJ6WYco2"});
        // await customer.selfPopulate();
        // customer.data.metadata.full_name = "Foo Bar (is back)";
        // await customer.save();
        // console.log("After updating: ", customer);
        // await customer.selfPopulate();
        // console.log("After populating: ", customer);

        return Promise.reject(false);
      }
      catch (err) {
        if (_.has(err, "isJoi") && _.get(err, "isJoi")) {
          return Promise.reject(generateError(err.details, null));
        }
        return Promise.reject(generateError(null, err));
      }

      // const customer = new Customer(this.stripe);
      // const subscription = new Subscription(this.stripe);
      // if (_.has(input, "params.customer")) {
      //   try {
      //     let newCustomer = await customer.create(_.get(input, "params.customer"));
      //     _.set(input, "params.subscription.customer", _.get(newCustomer, "id"));
      //     _.set(resolved, "data.customer", newCustomer);
      //
      //     let newSubscription = await subscription.create(_.get(input, "params.subscription"));
      //     _.set(resolved, "data.subscription", newSubscription);
      //     return Promise.resolve(resolved);
      //   } catch (err) {
      //     // eslint-disable-next-line
      //    return Promise.reject(err);
      //   }
      // }
      // else {
      //   if (this.model === "single_subscription") {
      //     return customer.isSubscribed(_.get(input, "params.subscription.customer"))
      //       .then((exists) => {
      //         if (! exists) {
      //           return subscription.create(_.get(input, "params.subscription"))
      //             .then((subscription) => {
      //               _.set(resolved, "data.subscription", subscription);
      //               return Promise.resolve(resolved);
      //             }).catch((error) => {
      //               _.set(rejected, "stripe", error);
      //               return Promise.reject(rejected);
      //             });
      //         }
      //         else {
      //           return Promise.reject({
      //             stush: [{
      //               message: "single_subscription model doesn't allow more than 1 subscription per user.",
      //               type: "unauthorized"
      //             }]
      //           });
      //         }
      //       }).catch((error) => {
      //         _.set(rejected, "stripe", error);
      //         return Promise.reject(rejected);
      //       });
      //   }
      //   else {
      //     return subscription.create(_.get(input, "params.subscription"))
      //       .then((subscription) => {
      //         _.set(resolved, "data.subscription", subscription);
      //         return Promise.resolve(resolved);
      //       }).catch((error) => {
      //         _.set(rejected, "stripe", error);
      //         return Promise.reject(rejected);
      //       });
      //   }
      // }
    }
    else {
      return Promise.reject(generateError(input.error.details));
    }
  }

  tinkerZone(customerId) {
    let customer = new Customer(this.stripe);
    return customer.isSubscribed(customerId);
  }
}

// debug("Tirth Bodawala");
// process.exit();
export default Stush;
module.exports = Stush;