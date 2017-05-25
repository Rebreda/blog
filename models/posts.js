var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var postSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }]
});

postSchema.virtual("url").get(function() {
  return "/post/" + this._id;
});

module.exports = mongoose.model("Post", postSchema);
