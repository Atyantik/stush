import Stripe from "stripe";
import _ from "lodash";
import Validator from "validations";
import Customer from "./customer/customer";
import Subscription from "./subscription/subscription";
import generateError from "./handler/error";

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
    let resolved = {};
    if (!input.error) {
      try {
        // let customer = new Customer(this, _.get(input, "params.customer"));
        // await customer.save();
        // console.log("After saving: ", customer);
        let customer = new Customer(this, {id: "cus_Bob0KkpJ6WYco2"});
        await customer.selfPopulate();
        customer.data.metadata.full_name = "Foo Bar (is back)";
        await customer.save();
        console.log("After updating: ", customer);
        // await customer.selfPopulate();
        // console.log("After populating: ", customer);

        return Promise.reject(false);
      }
      catch (err) {
        console.log("In catch: ", err);
        return Promise.reject(err);
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

export default Stush;
module.exports = Stush;