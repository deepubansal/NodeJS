angular.module('DeliciousApp.controllers', ['DeliciousApp.services']).

controller('popularBookmarksController', function($scope, $rootScope, deliciousService) {
  $scope.popularBoomarksList = [];
  deliciousService.getPopularBookmarks().success(function(response) {
    $scope.popularBoomarksList = response;
  });
}).

controller('bookmarksController', function($scope, $window, $location, $rootScope, deliciousService) {
  var req = {};
  req.sessionId = $window.sessionStorage.token;
  deliciousService.getMyBookmarks(req).success(function(response) {
    $scope.myBookmarks = response;
  }).
  error(function(data, status, headers, config) {
    $location.path('/login');
  });
}).

controller('bookmarkController', function($scope, $location, $window, $rootScope, deliciousService) {
  if ($rootScope.isLoggedIn) {
    $scope.newBookmark = {};
    $scope.newBookmark.sessionId = $window.sessionStorage.token;
    $scope.saveBookmark = function() {
      deliciousService.createBookmark($scope.newBookmark).success(function(response) {
        $location.path('/mybookmarks');
      });
    };
  } else {
    $location.path('/login');
  }
}).

controller('userController', function($scope, $location, $window, $rootScope, deliciousService, AuthenticationService) {
  $scope.login = {};
  // $scope.login.email = "Email";
  // $scope.login.password = "Password";  
  // $scope.login.confirmPassword = "Confirm Password";  

  $scope.doLogin = function() {
    deliciousService.login($scope.login).
    success(function(response) {
      AuthenticationService.isLogged = true;
      $rootScope.isLoggedIn = AuthenticationService.isLogged;
      $window.sessionStorage.token = response.sessionId;
      $rootScope.loggedInEmail = response.email;
      $location.path('/mybookmarks');
    }).

    error(function(data, status, headers, config) {
      $location.path('/login');
    });
  };

  $scope.signup = function() {
    if ($scope.login.password != $scope.login.confirmPassword) {
      return;
    }
    deliciousService.signup($scope.login).
    success(function(response) {
      $location.path('/login');
    }).

    error(function(data, status, headers, config) {
      $location.path('/login');
    });

  }


  $rootScope.logout = function() {
    var req = {};
    req.sessionId = $window.sessionStorage.token;
    deliciousService.logout(req).
    success(function(response) {
      AuthenticationService.isLogged = false;
      $rootScope.isLoggedIn = AuthenticationService.isLogged;
      delete $window.sessionStorage.token;
      $rootScope.loggedInEmail = null;
      $location.path('/login');
    }).

    error(function(data, status, headers, config) {
      AuthenticationService.isLogged = false;
      $rootScope.isLoggedIn = AuthenticationService.isLogged;
      delete $window.sessionStorage.token;
      $rootScope.loggedInEmail = null;
      $location.path('/login');
    });

  }
});