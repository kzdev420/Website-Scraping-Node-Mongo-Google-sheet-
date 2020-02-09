var express = require("express");
var News = require("../models/news");
var async = require("async");
var router = express.Router();

router.get("/get-statistics", async function(req, res) {
  let output = [];
  let functions = [];
  let outlets = [
    "bloomberg",
    "business-insider",
    "cnbc",
    "engadget",
    "forbes",
    "fortune",
    "hacker-news",
    "mashable",
    "recode",
    "reuters",
    "techcrunch",
    "the-huffington-post",
    "the-new-york-times",
    "the-next-web",
    "the-wall-street-journal",
    "usa-today",
    "venture-beat",
    "verge",
    "vice-news",
    "wired"
  ];
  let total_news_count = await News.count();
  let total_news_scrapped_count = await News.count({ author_email_scraped: true });
  outlets.forEach(function(outlet) {
    functions.push(function(callback) {
      (async () => {
        let total_count = await News.count({ source_id: outlet });
        let scrapped_count = await News.count({ source_id: outlet, author_email_scraped: true });
        output.push({
          name: outlet,
          total_count: total_count,
          scrapped_count: scrapped_count
        });
        callback();
      })();
    });
  });

  async.series(functions, function(err, result) {
    console.log(total_news_count, total_news_scrapped_count);
    res.render("statistics", { outlets: output, total_news_count: total_news_count, total_news_scrapped_count: total_news_scrapped_count });
  });
});

/* GET users listing. */
router.post("/search-news", async function(req, res) {
  console.log(req.body);
  var pageNum = req.body.page || 1;
  var limit = 10;

  var query = { $text: { $search: req.body.text } };

  if (req.body["outlets[]"] && req.body["outlets[]"].length) {
    query.source_id = req.body["outlets[]"];
  }

  query.author_email_scraped = true;
  console.log(query);
  let count = await News.find(query).count();
  let pages = Math.ceil(count / limit);
  console.log((pageNum - 1) * limit, limit);
  News.find(query)
    .skip((pageNum - 1) * limit)
    .limit(10)
    .sort({ date: -1 })
    .exec(function(err, docs) {
      // console.log(docs);
      res.send({ docs: docs, count: count, pages: pages });
    });
});
router.get("/get-article/:id", async function(req, res) {
  News.findOne({ _id: req.params.id }).exec(function(err, doc) {
    console.log("DD", doc);
    res.send(doc);
  });
});

module.exports = router;
