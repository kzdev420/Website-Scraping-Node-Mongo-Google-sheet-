var express = require("express");
var News = require("../models/news");
var Authors = require("../models/authors");
var _ = require("underscore");

var router = express.Router();

router.post("/sub-articles-search", async (req, res) => {
  let body = req.body;
  let news;
  console.log("/sub-articles-search", body);
  try {
    let sub_news_alert_id;

    if (req.body.id) {
      sub_news_alert_id = JSON.parse(req.body.id);
    }

    if (body.selectedAllResults == "1") {
      var query = { $text: { $search: body.searchQueryPhrase } };

      if (body.searchQueryOutlets) {
        try {
          var outlets = JSON.parse(body.searchQueryOutlets);
          query.source_id = { $in: outlets };
        } catch (e) {}
      }

      news = await News.find(query);
    } else {
      news = await News.find({ _id: { $in: sub_news_alert_id } });
    }

    let authorIds = news.map(function(doc) {
      return doc.author_id;
    });

    let uniqAuthors = _.uniq(authorIds);

    let authors = await Authors.find({ _id: { $in: uniqAuthors } });

    let authorsById = _.indexBy(authors, "_id");

    // console.log('AUTHOR IDS', authorsById)

    let articles = news
      .map(function(article) {
        let author = authorsById[article.author_id];
        if (author) {
          console.log("AUTHOR EMAIL", author.email);
          article.email = author.email;
        }
        return article;
      })
      .filter(function(article) {
        return !!article.email && !!article.author_hooty_id;
      });

    if (body.selectedAllResults == "1") {
      articles = _.uniq(
        articles.map(function(article) {
          return article.author_hooty_id;
        })
      );
    }

    res.send(articles);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
