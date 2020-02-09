var callNewsAPI = require('../helpers/newsApi');


var source = 'business-insider';

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