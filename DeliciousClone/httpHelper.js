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

function getSessionIdFromHeader(request) {
	var headers = request.headers;
	if (headers && headers.authorization) {
		return headers.authorization;
	} else {
		return null;
	}
};

exports.sendError = sendError;
exports.sendSuccess = sendSuccess;
exports.getSessionIdFromHeader = getSessionIdFromHeader;