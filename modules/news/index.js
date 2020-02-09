var business_insider = require("./business_insider");
var cnbc = require("./cnbc");
var mashable = require("./mashable");
var techcrunch = require("./techcrunch");
var the_next_web = require("./the_next_web");
var the_wall_street_journal = require("./the_wall_street_journal");

var venture_beat = require("./venture_beat");
var forbes = require("./forbes");
var bloomberg = require("./bloomberg");
var engadget = require("./engadget");
var fortune = require("./fortune");
var hacker_news = require("./hacker_news");
var recode = require("./recode");
var reuters = require("./reuters");
var the_huffington_post = require("./the_huffington_post");
var the_new_york_times = require("./the_new_york_times");
var usa_today = require("./usa_today");
var verge = require("./verge");
var vice_news = require("./vice_news");
var wired = require("./wired");

var newsOutlets = [
    business_insider,
    cnbc,
    mashable,
    techcrunch,
    the_next_web,
    the_wall_street_journal,
    venture_beat,
    forbes,
    bloomberg,
    engadget,
    fortune,
    hacker_news,
    recode,
    reuters,
    the_huffington_post,
    the_new_york_times,
    verge,
    usa_today,
    vice_news,
    wired
];

// var newsOutlets = [forbes];vice_news,
// add to venture_beat, forbes
//  business_insider,hacker_news, recode ,reuters,
// cnbc, mashable, techcrunch,reuters, the_huffington_post,verge,
// usa_today,
// the_new_york_times,
// the_next_web, the_wall_street_journal,bloomberg,engadget,fortune,hacker_news, recode ,

module.exports = newsOutlets;