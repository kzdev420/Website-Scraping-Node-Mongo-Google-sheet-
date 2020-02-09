var saveNews = require('../../controller/saveNews');
var rssParser = require('../helpers/rss');
var async = require('async')

let sourcesArray = ['money', 'billionaires', 'innovation', 'leadership', 'consumer', 'industry', 'lifestyle'];

function getNews() {
    return new Promise((resolve, reject) => {
        let functions = []
        sourcesArray.forEach((source) => {
            functions.push(function(callback) {
                findNews(source).then(function() {
                    callback();
                }).catch(() => {
                    callback()
                });
            })
        });
        async.series(functions, function(err, result) {
            resolve();
        })
    })
}

async function findNews(source) {
    let rss = await rssParser.load(`https://www.forbes.com/${source}/feed/`)
    console.log(source);
    try {
        // console.log(rss);
        let news = rss.items.map((feed) => {
            return {
                title: feed.title,
                image: feed.hasOwnProperty('media') && feed.media.content && feed.media.content.length && feed.media.content[0].url && feed.media.content[0].url.length ? feed.media.content[0].url[0] : null,
                content: feed.description,
                date: feed.created,
                url: feed.link,
                source_name: 'Forbes',
                source_id: 'forbes',
                author_name: feed.author ? feed.author.replace(", Contributor", "").replace("Forbes Staff", "").replace(",", "") : null,
                genre: source
            }
        });
        // console.log('NEWS', news);
        let savedNews = await saveNews(news);
    } catch (e) {
        console.log('error at forbes findNews ', e);
        throw e;
    }

    return;

}


module.exports = getNews;