var rssParser = require('../helpers/rss');
var saveNews = require('../../controller/saveNews');
var cheerio = require('cheerio');


async function getNews() {
    try {
        let rss = await rssParser.load('https://venturebeat.com/feed/');
        //Adding news
        let news = rss.items.map((feed) => {
            // console.log(feed);
            let img;
            // console.log(feeds);

            // let $ = cheerio.load(feed['content:encoded']);
            // img = $('img').attr('src');
            return {
                title: feed.title,
                // image: img,
                // keywords: feed.categories && feed.categories.length ? feed.categories.join() : null,
                content: feed.contentSnippet,
                date: feed.created,
                url: feed.link,
                source_name: 'Venture Beat',
                source_id: 'venture-beat',
                author_name: feed.author,
                scraped: false,
                genre: 'source'
            }

        });

        let savedNews = await saveNews(news);
        return;

    } catch (e) {
        console.log('error at venture_beat ', e);
        throw Error(e);
    }

}

module.exports = getNews;