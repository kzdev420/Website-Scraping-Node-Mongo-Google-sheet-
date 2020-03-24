const rp = require("request-promise");
const request = require("request");
const cheerio = require("cheerio");
var News = require("../models/news");
var async = require("async");
var journalistMySqlDatabase = require("../modules/helpers/journalistMySqlDatabase");
var retext = require("retext");
var retextKeywords = require("retext-keywords");
var toString = require("nlcst-to-string");

async function scrapper(source_id) {
  var news = await getNews(source_id);
  initiate(news);
}

// source_id_with_issues 'forbes, business-insider','bloomberg'
//source_id_that_works 'cnbc'

async function getNews(source_id) {
  var news = await News.find({ scraped: false, author_hooty_id: { $exists: true }, source_id: source_id });
  return news;
}

// mashable - keywords
// fortune - keywords
// reuters - keywords
// vice-news - keywords
// wired - keywords
// business-insider - keywords
// the-wall-street-journal - keywords
// engadget - script json
// the-huffington-post - script json
// cnbc - script json
// techcrunch - script json
// forbes - api json

function sanitizeKeywords(keywords) {
  let output = [];
  keywords = keywords.replace(/'/g, "");
  keywords = keywords.replace(/;/g, ",");

  keywords.split(",").forEach(function(keyword) {
    keyword = keyword.trim();

    keyword = keyword.charAt(0).toUpperCase() + keyword.slice(1);

    output.push(keyword.trim());
  });
  return output.join(", ");
}

function saveKeywords(n, keywords) {
  console.log("SANITIZED", sanitizeKeywords(keywords));
  News.findByIdAndUpdate(n._id, { $set: { keywords: sanitizeKeywords(keywords), scraped: true } }, (err, keyWordAdded) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Added");
    }
  });
  console.log("AUTHOR HOOTYID", n.author_hooty_id, keywords);
  if (n.author_hooty_id) {
    let author = { keywords: sanitizeKeywords(keywords), id: n.author_hooty_id };
    journalistMySqlDatabase.updateAuthor(author, function(err, result) {
      console.log(result);
    });
  }
}

function initiate(news) {
  let functions = [];
  news.forEach(function(n) {
    functions.push(function(callback) {
      const options = {
        uri: n.url,
        transform: function(body) {
          return cheerio.load(body);
        },
        maxRedirects: 3
      };

      const extractKeywordsFromContent = n => {
        retext()
          .use(retextKeywords)
          .process(n.content, function(err, file) {
            if (err) throw err;
            let keyphrases = [];
            console.log('Keywords:')
            file.data.keywords.forEach(function(keyword) {
              keyphrases.push(toString(keyword.matches[0].node));
            });

            file.data.keyphrases.forEach(function(phrase) {
              console.log(phrase.matches[0].nodes.map(stringify).join(','))
              keyphrases.push(
                phrase.matches[0].nodes
                  .map(stringify)
                  .filter(removeNull)
                  .join(", ")
              );

              function stringify(value) {
                return toString(value);
              }

              function removeNull(value) {
                return value, value.trim() !== "" && !!value;
              }
            });

            console.log("#####", keyphrases.join(", "));
            saveKeywords(n, keyphrases.join(", "));
            callback();
          });
      };

      if (n.source_id == "forbes") {
        rp({
          uri: "https://www.forbes.com/forbesapi/content/uri.json?uri=" + n.url
        })
          .then(function(response) {
            console.log(n.url);
            let news = JSON.parse(response);
            let keywords = news.content && news.content.authors.length ? news.content.authors[0].topics : news.content && news.content.googleKeywords ? news.content.googleKeywords : null;

            if (keywords) {
              saveKeywords(n, keywords);
              callback();
            } else {
              extractKeywordsFromContent(n);
            }
          })
          .catch(err => {
            console.log(err);
            extractKeywordsFromContent(n);
            // callback();
          });
      } else {
        rp(options)
          .then($ => {
            let meta_keywords = $("meta[name='keywords']").attr("content");
            let meta_news_keywords = $("meta[name='news_keywords']").attr("content");
            let script_json = $("script[type='application/ld+json']").html() ? JSON.parse($("script[type='application/ld+json']").html()).keywords : undefined;

            let keywords = meta_keywords || meta_news_keywords || (script_json && Array.isArray(script_json) ? script_json.join(",") : "");

            if (keywords) {
              saveKeywords(n, keywords);
              callback();
            } else {
              extractKeywordsFromContent(n);
            }
          })
          .catch(err => {
            console.log('ERROR', err);
            extractKeywordsFromContent(n);
            // callback();
          });
      }
    });
  });

  async.series(functions, function(err, callback) {
    console.log("DONE!!");
  });
}

// const options = {
//     uri: `http://www.forbesindia.com/article/leaderboard/tv-wars-oneplus-plays-it-smart/51411/1`,
//     transform: function (body) {
//       return cheerio.load(body);
//     }
//   };

//   rp(options)
//   .then(($) => {
//      console.log($('a').html());
//   })
//   .catch((err) => {
//     console.log(err);
//   });

module.exports = scrapper;
