var routes = [];
var httpHelper = require('./httpHelper');
var services = require('./services');

function addRoute(route, routeHandlerFunction, method, isAuthenticationRequired) {
	var routeValue = {};

	routeValue[method] = {}
	routeValue[method].routeHandlerFunction = routeHandlerFunction;
	routeValue[method].isAuthenticationRequired = isAuthenticationRequired;
	routes[route] = routeValue;
}

function getRoute(route, method) {
	if (routes[route]) {
		if (routes[route][method])
			return routes[route][method].routeHandlerFunction;
		else
			return function(response, postData, queryData) {
				console.log("Method not supported " + method);
				httpHelper.sendError(response, 405, "Method not supported !")
			}
	} else {
		return function(response, postData, queryData) {
			console.log("No request handler found for " + route);
			httpHelper.sendError(response, 404, "Resource not found !")
		}
	}
}

function isAuthenticationRequired(route, method) {
	if (routes[route]) {
		if (routes[route][method])
			if (routes[route][method].isAuthenticationRequired)
				return routes[route][method].isAuthenticationRequired;
		return false;
	}
}

function authenticate(parsedUrl, request, response, method) {
	if (isAuthenticationRequired(parsedUrl.pathname, method)) {
		var loginInfo = services.checkAuthentication(request, response);
		if (loginInfo)
			return loginInfo;
		httpHelper.sendError(response, 403, "Access Denied: Authentication Failed !");
		return null;
	} else
		return {};
}

exports.getRoute = getRoute;
exports.addRoute = addRoute;
exports.authenticate = authenticate;