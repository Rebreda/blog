var Tag = require("../models/tags");
var express = require("express"),
  router = express.Router(),
  mongoose = require("mongoose"), //mongo connection
  bodyParser = require("body-parser"), //parses information from POST
  methodOverride = require("method-override");

exports.index = function(req, res, next) {
  //retrieve all Tags from Monogo
  Tag.find({}, function(err, tags) {
    if (err) {
      return console.error(err);
    } else {
      //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
      res.format({
        //HTML response will render the index.jade file in the views/Tags folder. We are also setting "Tags" to be an accessible variable in our jade view
        html: function() {
          res.render("tags/index", {
            title: "All my Tags",
            tags: tags
          });
        },
        //JSON response will show all Tags in JSON format
        json: function() {
          res.send(JSON.stringify(Tags));
        }
      });
    }
  });
};

exports.newTag = function(req, res) {
  // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
  var Tag = new Tag({
    title: req.body.title,
    content: req.body.content
  });
  //call the create function for our database
  Tag.save(function(err) {
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

exports.getnewTag = function(req, res, next) {
  //render form
  res.format({
    html: function() {
      res.render("tags/new", {
        title: "Create a new Tag!"
      });
    }
  });
};

exports.PostnewTag = function(req, res, next) {
  //save Tag form

  var tag = new Tag({
    type: req.body.type,
    rating: req.body.rating
  });
  console.log("type: " + req.body.type);

  tag.save(function(err) {
    if (err) {
      res.json(err);
      return;
      // return next(err);
    }
    Tag.findOne({ type: req.body.type }).exec(function(err, type) {
      console.log("type: " + type);
      if (err) {
        // return next(err);
      }

      if (type) {
        //Genre exists, redirect to its detail page
        res.redirect(type.url);
      } else {
        tag.save(function(err) {
          if (err) {
            // return next(err);
          }
          //Genre saved. Redirect to genre detail page
          res.redirect(tag.url);
        });
      }
    });

    res.format({
      html: function() {
        res.redirect("/tags");
      },
      json: function() {
        res.json(req.body);
      }
    });
  });
};

exports.oneTag = function(req, res, next) {
  var id = req.id;

  Tag.findById(id, function(err, sTag) {
    if (err) {
      res.json(err);
      // return next(err);
    }
    res.format({
      html: function() {
        res.render("Tags/single", {
          Tag: {
            title: sTag.title,
            content: sTag.content
          }
        });
      },
      json: function() {
        res.json(sTag);
      }
    });
  });
};
