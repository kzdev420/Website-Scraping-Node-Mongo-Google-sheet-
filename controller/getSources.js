const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('6b856245d40748baa2920c8d8c9855ea');

var sources = newsapi.v2.sources({
  language: 'en',
  country: 'us'
}).then(response => {
  var l = response.sources
  var sources = response.sources.map((source) => {
    console.log(source.id);
    return {
      name:source.name,
      source_id:source.id,
    }
  });

  Sources.insertMany(sources,(err,savedSource) => {
    if(err){
      console.log('error at getSources Sources.insert ', err);
    }else{
      console.log("sources Added",savedSource);
    }
  })
});

module.exports = sources;