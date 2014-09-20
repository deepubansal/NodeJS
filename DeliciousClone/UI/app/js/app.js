var app = angular.module('DeliciousApp', [
	'DeliciousApp.services',
	'DeliciousApp.controllers',
	'ngRoute'
]);


app.config(['$routeProvider', '$httpProvider',
	function($routeProvider, $httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];

		$routeProvider.
		when("/", {
			templateUrl: "partials/popular_bookmarks.html",
			controller: "popularBookmarksController"
		}).
		when("/login", {
			templateUrl: "partials/login.html",
			controller: "userController",
			access: { requiredAuthentication: false }
		}).
		when("/mybookmarks", {
			templateUrl: "partials/mybookmarks.html",
			controller: "bookmarksController",
			access: { requiredAuthentication: true }
		}).
		when("/createBookmark", {
			templateUrl: "partials/create_bookmark.html",
			controller: "bookmarkController",
			access: { requiredAuthentication: true }
		}).
		when("/signup", {
			templateUrl: "partials/signup.html",
			controller: "userController",
			access: { requiredAuthentication: false }
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.run(function($rootScope, $location, $window, AuthenticationService) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {
        //redirect only if both isAuthenticated is false and no token is set
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication 
            && !AuthenticationService.isLogged && !$window.sessionStorage.token) {

            $location.path("/admin/login");
        }
    });
});