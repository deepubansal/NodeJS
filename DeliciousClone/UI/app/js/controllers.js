angular.module('DeliciousApp.controllers', ['DeliciousApp.services']).

controller('popularBookmarksController', function($scope, $rootScope, deliciousService) {
  $scope.popularBoomarksList = [];
  deliciousService.getPopularBookmarks().success(function(response) {
    $scope.popularBoomarksList = response;
    $scope.topMax = 5;
    $scope.total = response.length;
    $scope.isVisible = [];
    for (var i = 0; i < $scope.total; i++)
        $scope.isVisible.push(i < $scope.topMax);
    $scope.loadMore = function() {
      $scope.topMax += 5;
      for (var i = $scope.topMax - 5; i < $scope.topMax && $scope.total; i++) {
        $scope.isVisible[i] = true;
      };
    }
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
      $window.sessionStorage.loggedInEmail = response.email;
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
}).

controller('logoutController', function($scope, $location, $window, $rootScope, deliciousService, AuthenticationService) {

  $scope.logout = function() {
    var req = {};
    req.sessionId = $window.sessionStorage.token;
    deliciousService.logout(req).
    success(function(response) {
      AuthenticationService.isLogged = false;
      $rootScope.isLoggedIn = AuthenticationService.isLogged;
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.loggedInEmail;
      $rootScope.loggedInEmail = null;
      $location.path('/login');
    }).

    error(function(data, status, headers, config) {
      AuthenticationService.isLogged = false;
      $rootScope.isLoggedIn = AuthenticationService.isLogged;
      delete $window.sessionStorage.token;
      delete $window.sessionStorage.loggedInEmail;
      $rootScope.loggedInEmail = null;
      $location.path('/login');
    });

  };
});