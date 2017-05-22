var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"), //mongo connection
  bodyParser = require("body-parser"), //parses information from POST
  methodOverride = require("method-override"), //used to manipulate POST
  Post = require("../models/posts"), //get post model
  postcontroller = require("../controllers/postController"); //and the post controller

router.use(bodyParser.urlencoded({ extended: true }));
router.use(
  methodOverride(function(req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

//build the REST operations at the base for posts
//this will be accessible from http://127.0.0.1:3000/posts if the default route for / is left unchanged

// route middleware to validate :id
router.param("id", function(req, res, next, id) {
  //console.log('validating ' + id + ' exists');
  //find the ID in the Database
  Post.findById(id, function(err, post) {
    //if it isn't found, we are going to repond with 404
    if (err) {
      console.log(id + " was not found");
      res.status(404);
      var err = new Error("Not Found");
      err.status = 404;
      res.format({
        html: function() {
          next(err);
        },
        json: function() {
          res.json({ message: err.status + " " + err });
        }
      });
      //if it is found we continue on
    } else {
      //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
      //console.log(blob);
      // once validation is done save the new item in the req
      req.id = id;
      // go to the next thing
      next();
    }
  });
});

router.route("/:id").get(postcontroller.onepost);

router
  .route("/new")
  .get(postcontroller.getnewpost)
  .post(postcontroller.postnewpost);

router
  .route("/")
  .get(postcontroller.postlist) //POST a new Post
  .post(postcontroller.newpost);

module.exports = router;
