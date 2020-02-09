const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('a6c593ed9fa54516b87f9e358c90ff1d');

var sources =  newsapi.v2.sources({
    language: 'en',
    country: 'us'
    }).then(response => {
    var l = response.sources
    console.log(l.length);
     var sources = response.sources.map((source) => {
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