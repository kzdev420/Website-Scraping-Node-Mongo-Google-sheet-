var newsOutlets = require("../news");
var later = require("later");
var async = require("async");
var keywordScraping = require("../../controller/keywordScraping");
var moment = require("moment");
// var sources = require("../../controller/getSources");

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
  console.log('SCRAPE NEWS');
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
      "abc_news",
      "al_jazeera_english",
      "ars_technica",
      "associated_press",
      "axios",
      "bleacher_report",
      "breitbart_news",
      "buzzfeed",
      "cbs_news",
      "cnn",
      "crypto_coins_news",
      "entertainment_weekly",
      "espn",
      "espn_cric_info",
      "fox_news",
      "fox_sports",
      "google_news",
      "ign",
      "msnbc",
      "mtv_news",
      "medical_news_today",
      "national_geographic",
      "national_review",
      "nbc_news",
      "newsweek",
      "new_scientist",
      "new_york_magazine",
      "next_big_future",
      "nfl_news",
      "nhl_news",
      "politico",
      "polygon",
      "reddit_r_all",
      "the_american_conservative",
      "the_hill",
      "the_verge",
      "the_washington_post",
      "the_washington_times",
      "time",
      
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
