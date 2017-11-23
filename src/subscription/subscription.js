/**
 * Created by ravindra on 22/11/17.
 */

export default class Subscription {
  constructor(StripeInstance) {
    this.stripe = StripeInstance;
  }

  create(args) {
    return this.stripe.subscriptions.create(args)
      .then((subscription) => {
        return Promise.resolve(subscription);
      }).catch((error) => {
        return Promise.reject(error);
      });
  }
}

module.exports = Subscription;