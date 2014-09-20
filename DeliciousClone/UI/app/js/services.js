angular.module('DeliciousApp.services', [])
  .factory('deliciousService', function($http) {
    var deliciousService = {};
    deliciousService.getPopularBookmarks = function() {
      return $http.get('/api/popular');
    }
    deliciousService.getMyBookmarks = function(sessionId) {
      return $http.post('/api/mybookmarks', sessionId);
    }
    deliciousService.createBookmark = function(bookmark) {
      return $http.post('/api/bookmark', bookmark);
    }
    deliciousService.login = function(login) {
      return $http.post('/api/login', login);
    }
    deliciousService.logout = function(sessionId) {
      return $http.post('/api/logout', sessionId);
    }
    return deliciousService;
  });