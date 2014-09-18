var queryString = require('querystring');

function start(getRoute) {
	var server = require('http').createServer();
	var url = require("url");

	function requestHandler(request, response) {

		var postData = "";
		request.setEncoding("utf8");
		var parsedUrl = url.parse(request.url);
		console.log(parsedUrl.pathname);
		var queryData = queryString.parse(parsedUrl.query);
		console.log(queryData);
		request.addListener("data", function(postDataChunk) {
			postData += postDataChunk;
		});
		request.addListener("end", function() {
			postData = queryString.parse(postData);
			console.log(postData)
			getRoute(parsedUrl.pathname)(response, postData, queryData);
		});
	}
	server.on('request', requestHandler);
	server.listen(8181);
}

exports.start = start;