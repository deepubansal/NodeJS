angular.module('DeliciousApp.controllers', ['DeliciousApp.services']).

controller('popularBookmarksController', function($scope, $rootScope, deliciousService) {
  $scope.popularBoomarksList = [];
  deliciousService.getPopularBookmarks().success(function(response) {
    $scope.popularBoomarksList = response;
  });
}).

controller('bookmarksController', function($scope, $location, $rootScope, deliciousService) {

  $scope.getMyBookmarks = function() {
    var req = {};
    req.sessionId = $rootScope.sessionId;
    deliciousService.getMyBookmarks(req).success(function(response) {
      $scope.myBookmarks = response;
    }).
    error(function(data, status, headers, config) {
      $location.path('/login');
    });

    ;
  };
  $scope.getMyBookmarks();
  $scope.newBookmark = {};
  $scope.newBookmark.sessionId = $rootScope.sessionId;
  $scope.newBookmark.bookmark = "URL";
  $scope.newBookmark.tags = "Tags (comma separated)";

  $scope.saveBookmark = function() {
    deliciousService.createBookmark($scope.newBookmark).success(function(response) {
      $location.path('/mybookmarks');
    });
  };
}).

controller('userController', function($scope, $location, $rootScope, deliciousService) {
  $scope.login = {};
  // $scope.login.email = "Email";
  // $scope.login.password = "Password";  
  // $scope.login.confirmPassword = "Confirm Password";  
  
  $scope.doLogin = function() {
    deliciousService.login($scope.login).
    success(function(response) {
      $rootScope.sessionId = response.sessionId;
      $rootScope.isLoggedIn = true;
      $rootScope.loggedInEmail = response.email;
      $location.path('/mybookmarks');
    }).

    error(function(data, status, headers, config) {
      alert(status);
      $location.path('/login');
    });
  };

  $scope.signup = function() {
    if ($scope.login.password != $scope.login.confirmPassword) {
      return;
    }
    deliciousService.login($scope.login).
    success(function(response) {
      $location.path('/login');
    }).

    error(function(data, status, headers, config) {
      $location.path('/login');
    });

  }


  $rootScope.logout = function() {
    var req = {};
    req.sessionId = $rootScope.sessionId;
    deliciousService.logout(req).
    success(function(response) {
      $rootScope.sessionId = null;
      $rootScope.isLoggedIn = false;
      $rootScope.loggedInEmail = null;
      $location.path('/login');
    }).

    error(function(data, status, headers, config) {
      $rootScope.sessionId = null;
      $rootScope.isLoggedIn = false;
      $rootScope.loggedInEmail = null;
      $location.path('/login');
    });

  }
});