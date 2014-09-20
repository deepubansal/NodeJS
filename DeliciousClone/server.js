var queryString = require('querystring');
var application_root = __dirname;
var path = require("path");

function start(getRoute, authenticate) {
	//var server = require('http').createServer();
	var url = require("url");

	var express = require('express');
	var app = express();
	app.set('port', process.env.PORT || 8181);
	app.use('/ui/', express.static(path.join(application_root, "UI/app")));


	function requestHandler(request, response, method) {
		var postData = "";
		request.setEncoding("utf8");
		var parsedUrl = url.parse(request.url);
		console.log(parsedUrl.pathname);
		var queryData = queryString.parse(parsedUrl.query);
		console.log(queryData);
		var loginInfo = authenticate(parsedUrl, request, response, method);
		if (loginInfo) {
			request.addListener("data", function(postDataChunk) {
				postData += postDataChunk;
			});
			request.addListener("end", function() {
				if (postData)
					postData = JSON.parse(postData);
				console.log(postData);
				var data = {};
				data.postData = postData;
				data.queryData =  queryData;
				data.loginInfo = loginInfo;
				getRoute(parsedUrl.pathname, method)(response, data);
			});
		}
	}
	app.get('/api/*', function(request, response) {
		requestHandler(request, response, 'GET');
	});
	app.post('/api/*', function(request, response) {
		requestHandler(request, response, 'POST');
	});
	app.listen(8181);
}

exports.start = start;