var express = require("express");
var app = express();
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var creds = require("./creds"); //hold cred data, not on git!
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

//db connection
var mongoose = require("mongoose");
var mongoDB = "mongodb://admin:405343@ds147711.mlab.com:47711/blogdata";
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error: "));
//db end

passport.use(
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user || !!user.validPassword(password)) {
        return done(null, false, {
          message: "Incorrect username or password."
        });
      }
      return done(null, user);
    });
  })
);

var index = require("./routes/index");
var users = require("./routes/users");
var posts = require("./routes/post");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "ilovelargelemonypotatoes",
    name: "cname",
    resave: false,
    saveUninitialized: false
  })
); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//check if auth
app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  next();
});

app.use("/", index);
app.use("/users", users);
app.use("/posts", posts);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
