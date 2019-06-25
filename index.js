/*jshint esversion: 6 */
var request = require('request-promise');
var cheerio = require('cheerio');
var _ = require('lodash');
var baseURL = 'https://www.instagram.com/explore/tags/';
var apicache = require('apicache');
var express = require('express');
let cache = apicache.middleware;

var app = express();

app.use(function (req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.use(cache('360 minutes'));

app.get('/tag/:tag', function(req, res){
	var tag = req.params.tag;
	console.log(tag);
	getTag(tag, res);
});

app.get('/user/:username', function(req, res){
	var username = req.params.username;
	console.log(username);
	getUser(username, res);
});
var port = process.env.PORT || 3000;

instructions = 	[	'Getstagram @ 0.0.0.0:'+port,
    '/            ping',
    '/user:username username',
    '/tag/:tag    tag'
];

app.get('/', function (req, res){
    res.send(instructions);
});

app.listen(port, function (){
	console.log(instructions);
});

function getTag(tag, res) {
	request(baseURL+tag)
	.then(htmlString => {
		$ = cheerio.load(htmlString);
		var scripts = $('script[type="text/javascript"]');
		var data;
		for(var i in scripts){
			if(	scripts[i].type === 'script' &&
				scripts[i].children[0] &&
				scripts[i].children[0].data &&
				/_sharedData/.test(scripts[i].children[0].data)
				){
                data = scripts[i].children[0].data
                if (! data.includes('window._sharedData =')) continue;
                data = data.replace('window._sharedData = ', '');
				data = data.substr(0, data.length-1);
                data = cleanData(JSON.parse(data));
				res.send({posts: data});
			}
		}
	});
}

function getUser(username, res) {
	request('https://www.instagram.com/'+username)
	.then(htmlString => {
		$ = cheerio.load(htmlString);
		var scripts = $('script[type="text/javascript"]');
		var data;
		for(var i in scripts){
			if(	scripts[i].type === 'script' &&
				scripts[i].children[0] &&
				scripts[i].children[0].data &&
				/_sharedData/.test(scripts[i].children[0].data)
				){
                data = scripts[i].children[0].data
                if (! data.includes('window._sharedData =')) continue;
                data = data.replace('window._sharedData = ', '');
				data = data.substr(0, data.length-1);
                data = cleanData(JSON.parse(data), true);
				res.send({posts: data});
			}
		}
	});
}

function cleanData(data, user=false){
    data = !user ? data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.edges
    : data.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges;
    console.log(data)
    return data.map(entry => {
        newEntry = _.pick(entry.node, [
            'dimensions',
            'thumbnail_src',
            'is_video',
            'display_url',
            'shortcode',
        ])
        newEntry.date = entry.node.taken_at_timestamp
        newEntry.likes = entry.node.edge_liked_by && entry.node.edge_liked_by.count;
        newEntry.caption = entry.node.edge_media_to_caption.edges[0] && entry.node.edge_media_to_caption.edges[0].node.text
        newEntry.link = 'https://www.instagram.com/p/'+newEntry.shortcode;
        delete newEntry.shortCode;
        return newEntry;
    });
}
