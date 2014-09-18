function sendError(response, code, message) {
	response.writeHead(code, {
		"Content-Type": "text/plain"
	});
	response.write("HTTP-" + code + ": " + message);
	response.end();
}

function sendSuccess(response, message) {
	response.write(message);
	response.end();
}

exports.sendError = sendError;
exports.sendSuccess = sendSuccess;