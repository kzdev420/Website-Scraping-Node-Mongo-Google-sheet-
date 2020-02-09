
const {google} = require('googleapis');
const fetch = require('node-fetch');
global.Headers = fetch.Headers;

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

function sendToGoogle(article){
  get_access_token_using_saved_refresh_token(article);
}

function get_access_token_using_saved_refresh_token(article) {
  const refresh_token = process.env.GOOGLE_SHEETS_API_REFRESH_TOKEN; 
  const client_id = process.env.GOOGLE_SHEETS_API_CLIENT_ID;
  const client_secret = process.env.GOOGLE_SHEETS_API_CLIENT_SECRET;
  const refresh_url = process.env.GOOGLE_SHEETS_API_REFRESH_URL; 

  const post_body = `grant_type=refresh_token&client_id=${encodeURIComponent(client_id)}&client_secret=${encodeURIComponent(client_secret)}&refresh_token=${encodeURIComponent(refresh_token)}`;

  let refresh_request = {
      body: post_body,
      method: 'POST',
      headers: new Headers({
          'Content-Type': 'application/x-www-form-urlencoded'
      })
  }

  fetch(refresh_url, refresh_request).then( response => {
    return(response.json());
  }).then( response_json =>  {

    submitQuery(article, response_json.access_token);
  });
}

function submitQuery(article, accessToken) {
  const append_url = `${process.env.GOOGLE_SHEETS_SPREADSHEET}/values/Sheet1!A1:O1:append?valueInputOption=USER_ENTERED`;

  let putBodyObject = {}
  putBodyObject = {
    "range": "Sheet1!A1:O1",
    "majorDimension": "ROWS",
    "values": [
      [
        article.title || '',
        article.image || '',
        article.keywords || '',
        article.content || '',
        article.date || '',
        article.url || '',
        article.source_name || '',
        article.source_id || '',
        article.author_id || '',
        article.author_hooty_id || '',
        article.author_name || '',
        article.scraped || '',
        article.author_email_scraped || '',
        article.genre || '',
        article.email || '',
        article.dateDBAdded || ''
      ],
    ],
  }
 
  putBodyObject = JSON.stringify(putBodyObject);
  let append_request = {
    body: putBodyObject,
    method: 'POST',
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken,
        'Accept': '*/*'
    })
  }
  // post to the refresh endpoint, parse the json response and use the access token to call files.list
   fetch(append_url, append_request).then( response => {
      console.log('fetch response is ', response);
      return(response.json());
    }).then( response_json =>  {
        console.log('response is ',response_json);
  });
}

module.exports = sendToGoogle;