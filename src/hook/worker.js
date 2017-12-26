/**
 * Created by ravindra on 26/12/17.
 */
import _ from "lodash";

export default class Worker{
  constructor(task, cb) {
    try {
      // TODO: Logic to emit the received events
      task.stushInstance._emitter.emit(_.get(task, "stripeEvent.type", "unidentified_event"));
      cb(null, {
        type: _.get(task, "stripeEvent.type", "unidentified_event"),
        event: _.get(task, "stripeEvent", {})
      });
    }
    catch (err) {
      cb(err, null);
    }
  }
}