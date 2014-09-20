var routes = [];

function addRoute(route, routeHandlerFunction, method) {
	var routeValue = {};
	routeValue[method] = routeHandlerFunction;
	routes[route] = routeValue;
}

function getRoute(route, method) {
	if (routes[route]) {
		if (routes[route][method])
			return routes[route][method];
		else
			return function(response, postData, queryData) {
			console.log("Method not supported " + method);
			require('./httpHelper').sendError(response, 405, "Method not supported !")
		}
	} else {
		return function(response, postData, queryData) {
			console.log("No request handler found for " + route);
			require('./httpHelper').sendError(response, 404, "Resource not found !")
		}
	}
}

exports.getRoute = getRoute;
exports.addRoute = addRoute;