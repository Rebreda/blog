var Post = require("../models/posts");
var Tag = require("../models/tags");
var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"), //mongo connection
  bodyParser = require("body-parser"), //parses information from POST
  methodOverride = require("method-override"); //used to manipulate POST

exports.postlist = function(req, res, next) {
  //retrieve all posts from Monogo
  Post.find({}, function(err, posts) {
    if (err) {
      return console.error(err);
    } else {
      //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
      res.format({
        //HTML response will render the index.jade file in the views/posts folder. We are also setting "posts" to be an accessible variable in our jade view
        html: function() {
          res.render("posts/index", {
            title: "All my posts",
            posts: posts
          });
        },
        //JSON response will show all posts in JSON format
        json: function() {
          res.send(JSON.stringify(posts));
        }
      });
    }
  });
};

exports.newpost = function(req, res) {
  // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
  console.log(req.body);
  var post = new Post({
    title: req.body.title,
    content: req.body.content,
    tag: typeof req.body.tag === "undefined" ? [] : req.body.tag.split(",")
  });
  // console.log(req.body.tag.split(","));
  //call the create function for our database
  post.save(function(err) {
    if (err) {
      res.json(req.body);
      // return next(err);
    }
    res.format({
      html: function() {
        //
      },
      json: function() {
        res.json(req.body);
      }
    });
  });
};

exports.getnewpost = function(req, res, next) {
  //render form

  Tag.find({}, function(err, tags) {
    if (err) {
      return console.error(err);
    } else {
      //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
      res.format({
        //HTML response will render the index.jade file in the views/posts folder. We are also setting "posts" to be an accessible variable in our jade view
        html: function() {
          res.render("posts/new", {
            title: "Create a new post!",
            tags: tags
          });
        },
        //JSON response will show all posts in JSON format
        json: function() {
          res.send(JSON.stringify(tags));
        }
      });
    }
  });
};

exports.postnewpost = function(req, res, next) {
  //save post form
  console.log(req.body.tag.toString().split(","));
  var post = new Post({
    title: req.body.title,
    content: req.body.content,
    tags: typeof req.body.tag === "undefined"
      ? []
      : req.body.tag.toString().split(",")
  });

  post.save(function(err) {
    if (err) {
      res.json(err);
      // return next(err);
    }
    res.format({
      html: function() {
        res.redirect("/posts");
      },
      json: function() {
        res.json(req.body);
      }
    });
  });
};

exports.onepost = function(req, res, next) {
  var id = req.id;

  Post.findOne({ _id: id }, function(err, spost) {
    if (err) {
      res.json(err);
      // return next(err);
    }
  })
    .populate("tags")
    .exec(function(err, post) {
      console.log(post);
      res.format({
        html: function() {
          res.render("posts/single", {
            post: post
          });
        },
        json: function() {
          res.json(post);
        }
      });
    });
};
