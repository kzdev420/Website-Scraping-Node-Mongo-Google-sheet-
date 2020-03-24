
var callNewsAPI = require('../helpers/newsApi');


var source = 'medical-news-today';

async function GetNews() {
    try {
        await callNewsAPI(source);
        return;
    } catch (e) {
        console.log('WWWW', e);
        throw Error(e);
    }


}



module.exports = GetNews;