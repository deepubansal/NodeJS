var routes = {};

function addRoute(route, routeHandlerFunction) {
	routes[route] = routeHandlerFunction;
}

function getRoute(route) {
	if (routes[route]) {
		return routes[route];
	} else {
		return function(response, postData, queryData) {
			console.log("No request handler found for " + route);
			require('./httpHelper').sendError(response, 404, "Resource not found !")
		}
	}
}

exports.getRoute = getRoute;
exports.addRoute = addRoute;