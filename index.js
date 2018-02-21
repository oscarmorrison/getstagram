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

app.use(cache('5 minutes'));

app.get('/tag/:tag', function(req, res){
	var tag = req.params.tag;
	console.log(tag);
	getTag(tag, res);
});

app.get('/', function (req, res){
    console.log('ping');
    res.send({  response: 'Pinging from Getstagram API' });
});

var port = process.env.PORT || 3000;
app.listen(port, function (){
	instructions = 	[	'Getstagram @ 0.0.0.0:'+port,
						'/            ping',
						'/tag/:tag    tag'
					];
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
				data = scripts[i].children[0].data.replace('window._sharedData = ', '');
				data = data.substr(0, data.length-1);
				data = cleanData(JSON.parse(data));
				res.send({posts: data});
			}
		}
	});

	function cleanData(data){
        data = data.entry_data.TagPage[0].graphql.hashtag.edge_hashtag_to_media.edges;
        return data.map( entry => {
            newEntry = _.pick(entry.node, [
                'date',
                'caption',
                'dimensions',
                'caption',
                'thumbnail_src',
                'is_video',
                'display_url',
                'shortcode',
            ])
            newEntry.likes = entry.node.edge_liked_by && entry.node.edge_liked_by.count;
            newEntry.caption = entry.node.edge_media_to_caption.edges[0].node.text
            newEntry.link = 'https://www.instagram.com/p/'+newEntry.shortcode;
            delete newEntry.shortCode;
            return newEntry;
        });
	}
}
