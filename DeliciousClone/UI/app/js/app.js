angular.module('DeliciousApp', [
	'DeliciousApp.services',
	'DeliciousApp.controllers',
	'ngRoute'
]).
config(['$routeProvider', '$httpProvider',
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
			controller: "userController"
		}).
		when("/mybookmarks", {
			templateUrl: "partials/mybookmarks.html",
			controller: "bookmarksController"
		}).
		when("/createBookmark", {
			templateUrl: "partials/create_bookmark.html",
			controller: "bookmarksController"
		}).
		otherwise({
			redirectTo: '/'
		});
	}
]);