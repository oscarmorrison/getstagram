/*jshint esversion: 6 */
var request = require('request-promise');
var cheerio = require('cheerio');
var baseURL = 'https://www.instagram.com/explore/tags/';
var tag = 'TOSTiceland';

request(baseURL+tag)
	.then(htmlString => {
		$ = cheerio.load(htmlString);
		var scripts = $('script[type="text/javascript"]');
		var data;
		for(var i in scripts){
			if(scripts[i].type === 'script'){
					if(scripts[i].children[0]){
						if(scripts[i].children[0].data){
							if(/_sharedData/.test(scripts[i].children[0].data)){
								data = scripts[i].children[0].data;
								data = data.replace('window._sharedData = ', '');
								data = data.substr(0, data.length-1);
								// data = JSON.parse(data);
							}
						}
					}	
			}
		}
		console.log(data);
		// scripts.forEach(function(item){ 
		// 	console.log(item.text);
		// 	if(/window._sharedData/.test(scripts[i].text)){
		// 		data = scripts[i].text;
		// 	}
		// });
		// console.log(data);
	});