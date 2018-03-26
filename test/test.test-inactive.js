import assert from "assert";
console.log("In test test >>>>>>>>>>>>> ", process.env.npm_config_SECRET_KEY);
describe("Array", function() {
  describe("#indexOf()", () => {
    it("should return -1 when the value is not present", () => {
      assert.equal([1,2,3].indexOf(4), -1);
    });
    it("should return index when the value is present", () => {
      assert.equal([1,2,3].indexOf(3), 2);
    });
  });
});