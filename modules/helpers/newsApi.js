const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("6b856245d40748baa2920c8d8c9855ea");
var saveNews = require("../../controller/saveNews");
var utils = require("../helpers/utils");
var async = require("async");
var moment = require("moment");

function callNewsAPI(source, page = 1, date) {
  return new Promise(function(resolve, reject) {
    let nextdate = moment(date, "Y-M-D")
      .add(1, "days")
      .format("Y-M-D");
    console.log(date, nextdate, source);
    var query = {
      sources: source,
      from: date,
      to: nextdate,
      language: "en",
      sortBy: "relevancy",
      page: page
    };
    console.log(query);
    var numberOfPages = 0;
    newsapi.v2
      .everything(query)
      .then(async response => {
        await saveNews(response.articles);
        if (page === 1) {
          var totalArticles = response.totalResults;
          numberOfPages = Math.ceil(totalArticles / 20);
          console.log("number of pages", numberOfPages, totalArticles);
          resolve(numberOfPages);
        } else {
          resolve();
        }
      })
      .catch(err => {
        reject();
        console.log("error at callNewsAPI", err);
      });
  });
}

function getNews(source) {
  return new Promise(function(resolve, reject) {
    var fromto = [
      moment()
        .subtract(1, "days")
        .format("Y-M-D")
    ];
    var functions = [];
    fromto.forEach(date => {
      functions.push(function(cb) {
        callNewsAPI(source, 1, date)
          .then(pages => {
            if (pages > 1) {
              let pageArray = utils.fillRange(2, pages);
              async.each(
                pageArray,
                function(page, callback) {
                  callNewsAPI(source, page, date)
                    .then(function() {
                      callback();
                    })
                    .catch(err => {
                      console.log("WWW");
                      callback(true);
                    });
                },
                function(err) {
                  if (err) {
                    cb(err);
                  } else {
                    cb();
                  }
                }
              );
            } else {
              cb();
            }
          })
          .catch(err => {
            cb(err);
          });
      });
    });
    async.series(functions, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = getNews;
