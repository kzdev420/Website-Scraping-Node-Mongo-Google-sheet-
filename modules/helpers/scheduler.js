var newsOutlets = require("../news");
var later = require("later");
var async = require("async");
var keywordScraping = require("../../controller/keywordScraping");
var moment = require("moment");

function scheduleScraping(text) {
  if (text) {
    var s = later.parse.text(text);
    var res = later.schedule(s).next(5);
    console.log(res);
    later.setInterval(scrapeNews, s);
  } else {
    scrapeNews();
  }
}

function scrapeNews() {
  // console.log('SCRAPE NEWS');
  let functions = [];
  newsOutlets.forEach(Outlet => {
    functions.push(function(callback) {
      // callback()
      Outlet()
        .then(function() {
          callback();
        })
        .catch(function() {
          console.log("CAUGHT!!!");
          callback();
        });
    });
  });

  async.series(functions, function(err, result) {
    console.log("SCRAPPING DONE!!! for" + moment().format("llll"));
    let source_ids = [
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
    source_ids.forEach(function(source) {
      keywordScraping(source);
    });
    scheduleScraping("at 5:00 am tomorrow");
    // scheduleScraping("at 5:00 am tomorrow");
  });
}

module.exports = scheduleScraping;
