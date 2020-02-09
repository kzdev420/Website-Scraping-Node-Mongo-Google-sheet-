var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
var Authors = require("./models/authors");
var async = require("async");
require("dotenv").config();

var authorsRouter = require("./routes/authors");
var keywordsRouter = require("./routes/keywords");
var articlesRouter = require("./routes/article");
var s3Router = require("./routes/s3SignedUrl");
var journalistMySqlDatabase = require("./modules/helpers/journalistMySqlDatabase");
var scheduleScraping = require("./modules/helpers/scheduler");
var keywordScraping = require("./controller/keywordScraping");
var Sources = require("./models/sources");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "hbs");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

mongoose.Promise = global.Promise;

mongoose.connect(process.env.DB_HOST, function(err) {
  if (err) throw err;
  console.log("CONNECTED TO DB!!");
  scheduleScraping();
});

app.use("/v1", authorsRouter);
app.use("/v1", keywordsRouter);
app.use("/v1", articlesRouter);
app.use("/v1", s3Router);

//SCRAPPER

// scheduleScraping();

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
});

module.exports = app;
