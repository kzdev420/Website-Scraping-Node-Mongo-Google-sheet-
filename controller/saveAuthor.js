var Authors = require('../models/authors');
var News = require('../models/news');
var async = require('async');
var request = require('request');
var stringSimilarity = require('string-similarity');
var journalistMySqlDatabase = require('../modules/helpers/journalistMySqlDatabase');
//  //AUTHOR TO DATABASE
function saveAuthor(articles) {
    let saveAuthorFunctions = [];

    articles.forEach(function(article) {
        saveAuthorFunctions.push(function(callback) {

            if (!article) return callback();

            if (!article.author_name) {
                return callback();
            }
            let author = { name: article.author_name, source_id: article.source_id, source_name: article.source_name }
            Authors.findOneAndUpdate(author, author, { upsert: true, new: true }, function(err, author) {

                let name = author.name.split(' ');

                let savedAuthor = {
                    First_name: name[0],
                    Last_name: name.splice(1, 1).join(' '),
                    Domain_name: article.source_name
                }

                let params = { author_id: author._id };

                //CHECK IF HOOTY MYSQL DATABASE HAS AUTHORS OF SAME NAME + OUTLET NAME
                /*
                journalistMySqlDatabase.findAuthors(savedAuthor, function(err, results){

                    //console.log('MYSQL RESULTS',results);
                    
                    if (err) {
                        console.log('ERRR', err);
                        return callback();
                    }

                    let searchParams = savedAuthor.First_name + ' ' + savedAuthor.Last_name + ' ' + savedAuthor.Domain_name;
                    // console.log('BODY', body[0]);
                    let existingAuthors = [];

                    if (results && results.length && Array.isArray(results)) {

                        existingAuthors = results.filter(function(athr) {
                            let name = athr.First_name + ' ' + athr.Last_name + ' ' + athr.Domain_name;
                            let relevancy = stringSimilarity.compareTwoStrings(name, searchParams);
                            if (relevancy > 0.8) return athr;
                        })

                        let athr = existingAuthors.length ? existingAuthors[0] : undefined;
                   
                        if (athr && athr.email_address) {
                            Authors.findOneAndUpdate({ _id: author._id }, { $set: { email: athr.email_address, scraped: true } }, function(err, result) {});
                        }

                        if (athr) {
                            params.author_hooty_id = athr.id;
                        }

                    }

                    News.update({ author_name: author.name, source_id: author.source_id, source_name: author.source_name }, params, { multi: true }, function(err, result) {
                        callback();
                    })

                });
                */
                // request.post({ url: process.env.HOOTY_URL + '/find-journalist', json: savedAuthor }, function(err, httpResponse, body) {
                //     if (err) {
                //         console.log('ERRR', err);
                //         return callback();
                //     }

                //     let searchParams = savedAuthor.First_name + ' ' + savedAuthor.Last_name + ' ' + savedAuthor.Domain_name;
                //     // console.log('BODY', body[0]);
                //     let existingAuthors = [];

                //     if (body && body.length && Array.isArray(body)) {
                //         existingAuthors = body.filter(function(athr) {
                //             let name = athr.First_name + ' ' + athr.Last_name + ' ' + athr.Domain_name;
                //             let relevancy = stringSimilarity.compareTwoStrings(name, searchParams);
                //             if (relevancy > 0.8) return athr;
                //         })
                //     }

                //     let athr = existingAuthors[0];

                   
                //     if (athr && athr.email_address) {
                //         Authors.findOneAndUpdate({ _id: author._id }, { $set: { email: athr.email_address, scraped: true } }, function(err, result) {});
                //     }

                //     let params = { author_id: author._id }

                //     if (athr) {
                //         params.author_hooty_id = athr.id;
                //     }

                //     News.update({ author_name: author.name, source_id: author.source_id, source_name: author.source_name }, params, { multi: true }, function(err, result) {
                //         callback();
                //     })
                // })
            })
        })
    })

    async.series(saveAuthorFunctions, function(err, result) {
        console.log('AUTHORS SAVED');
    })
}



module.exports = saveAuthor;