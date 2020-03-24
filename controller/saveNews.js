var News = require('../models/news');
var async = require('async');
var saveAuthor = require('./saveAuthor');
var sendToGoogle = require('./sendToGoogle');
var GoogleSpreadsheet = require('google-spreadsheet');
var creds = require('../hootypresshuntarticles-57fd41693f0c.json');
var doc = new GoogleSpreadsheet('1wkPHlN8cEWDWM-RhvQ4D6mIIpk79jtqUKg2F_PVSVvM');

//comment for saveNews MH
function saveNews(articles) {

    return new Promise(function(resolve, reject) {
        try {
            let functions = [];
            let newsOutput = [];
            articles.forEach(function(article) {
                functions.push(function(callback) {
                    News.findOne({ title: article.title, source_id: article.source_id }, async function(err, news) {
                        console.log(article.source_id + ' - News Saved');
                        if (!news) {
                            // var res =await savetosheet(article);
                            doc.useServiceAccountAuth(creds,async function() {  
                                await doc.addRow(1, {
                                    title_t: article.title,
                                    image: article.image,
                                    keywords_t: article.keywords,
                                    content_t: article.content,
                                    date: article.date,
                                    url: article.url,
                                    source_name: article.source_name,
                                    source_id: article.source_id,
                                    author_id: article.author_id,
                                    author_name: article.author_name,
                                    scraped: article.scraped,
                                    author_email_scraped: article.author_email_scraped,
                                    genre: article.genre,
                                    email: article.email
                                }, function (err) {
                                    if (err) {
                                        callback();
                                    } else{
                                        article.dateDBAdded = Date.now();
                                        let savedNews = new News(article);
                                        savedNews.save(function(err, nws) {
                                            console.log(err, article.source_id + ' - News Saved');
                                            newsOutput.push(nws);
                                            callback();
                                        });
                                        sendToGoogle(article);
                                    }
                                });
                            });
                        } else {
                            callback();
                        }
                    });
                })
            })

            async.series(functions, function(err, result) {
                resolve(newsOutput)
            })
        } catch (e) {
            console.log('save news Promise error', e);
        }
    })
}

function savetosheet(article){
    doc.useServiceAccountAuth(creds,async function() {  
        await doc.addRow(1, {
            title_t: article.title,
            image: article.image,
            keywords_t: article.keywords,
            content_t: article.content,
            date: article.date,
            url: article.url,
            source_name: article.source_name,
            source_id: article.source_id,
            author_id: article.author_id,
            author_name: article.author_name,
            scraped: article.scraped,
            author_email_scraped: article.author_email_scraped,
            genre: article.genre,
            email: article.email
        }, function (err) {
            if (err) {
                return false;
            }
        });
    });
    return true;
}

async function iterateNews(response) {

    var articles = response.map((article) => {
        let author_name = article.author_name ? article.author_name : article.author;
        return {
            title: article.title,
            image: article.image ? article.image : article.urlToImage,
            content: article.content,
            date: article.date ? article.date : article.publishedAt,
            url: article.url,
            source_name: article.source_name ? article.source_name : article.source.name,
            source_id: article.source_id ? article.source_id : article.source.id,
            author_name: author_name ? author_name.replace(/^\s+|\s+$/g, "") : null
        }
    });

    articles = articles.filter((article) => {
        return article.author_name !== null && article.author_name !== undefined;
    })

    try {
        let savedNews = await saveNews(articles);
        let savedAuthors = saveAuthor(savedNews);
    } catch (e) {
        console.log('saveNews error ', e);
    }

    return;

}


module.exports = iterateNews;