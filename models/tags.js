var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var tagSchema = Schema({
  type: { type: String, required: true },
  rating: { type: String, required: true }
});

tagSchema.virtual("url").get(function() {
  return "/tags/" + this._id;
});

module.exports = mongoose.model("Tag", tagSchema);
