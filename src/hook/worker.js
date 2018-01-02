/**
 * Created by ravindra on 26/12/17.
 */
import _ from "lodash";

export default class Worker {
  static process(task, cb) {
    try {
      // TODO: Logic to emit the received events
      console.log("\n\n\n\n\nEMITTING EVENT!\n\n\n\n\n");
      const eventObject = {
        type: _.get(task, "stripeEvent.type", "unidentified_event"),
        event: _.get(task, "stripeEvent", {})
      };
      task.stushInstance._emitter.emit(_.get(task, "stripeEvent.type", "unidentified_event"), eventObject);
      cb(null, eventObject);
    }
    catch (err) {
      cb(err, null);
    }
  }
}