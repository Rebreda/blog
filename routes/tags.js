var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"), //mongo connection
  bodyParser = require("body-parser"), //parses information from POST
  methodOverride = require("method-override"), //used to manipulate POST
  Tag = require("../models/tags"), //get post model
  tagcontroller = require("../controllers/tagControllers"); //and the post controller

router.use(bodyParser.urlencoded({ extended: true }));
// router.use(
//   methodOverride(function(req, res) {
//     if (req.body && typeof req.body === "object" && "_method" in req.body) {
//       // look in urlencoded POST bodies and delete it
//       var method = req.body._method;
//       delete req.body._method;
//       return method;
//     }
//   })
// );

//build the REST operations at the base for posts
//this will be accessible from http://127.0.0.1:3000/posts if the default route for / is left unchanged
router
  .route("/new")
  .get(tagcontroller.getnewTag)
  .post(tagcontroller.PostnewTag);
// route middleware to validate :id

// router.route("/:id").get(tagcontroller.onepost);

router.route("/").get(tagcontroller.index); //POST a new Post
// .post(tagcontroller.newpost);

module.exports = router;
