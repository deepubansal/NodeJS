var appServices = angular.module('DeliciousApp.services', []);

appServices.factory('deliciousService', function($http) {
  var deliciousService = {};
  deliciousService.getPopularBookmarks = function() {
    return $http.get('/api/popular');
  }
  deliciousService.getMyBookmarks = function(sessionId) {
    return $http.get('/api/mybookmarks', sessionId);
  }
  deliciousService.createBookmark = function(bookmark) {
    return $http.post('/api/bookmark', bookmark);
  }
  deliciousService.login = function(login) {
    return $http.post('/api/login', login);
  }
  deliciousService.logout = function(request) {
    return $http.get('/api/logout', request);
  }
  deliciousService.signup = function(signup) {
    return $http.post('/api/signup', signup);
  }
  return deliciousService;
});


appServices.factory('AuthenticationService', function($rootScope) {
  var auth = {
    isLogged: false
  }
  return auth;
});

appServices.factory('TokenInterceptor', function($q, $window, $rootScope, $location, AuthenticationService) {
  return {
    request: function(config) {
      config.headers = config.headers || {};
      if ($window.sessionStorage.token) {
        config.headers.Authorization = $window.sessionStorage.token;
      }
      return config;
    },

    requestError: function(rejection) {
      return $q.reject(rejection);
    },

    /* Set AuthenticationService.isLogged to true if 200 received */
    response: function(response) {
      if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isLogged) {
        AuthenticationService.isLogged = true;
        $rootScope.isLoggedIn = AuthenticationService.isLogged;
      }
      return response || $q.when(response);
    },

    /* Revoke client authentication if 401 is received */
    responseError: function(rejection) {
      if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isLogged)) {
        delete $window.sessionStorage.token;
        AuthenticationService.isLogged = false;
        $rootScope.isLoggedIn = AuthenticationService.isLogged;
        $location.path("/login");
      }

      return $q.reject(rejection);
    }
  };
});