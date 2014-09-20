var server = require('./server');
var controller = require('./controller');
var services = require('./services');

server.start(controller.getRoute, controller.authenticate);

controller.addRoute('/api/login', services.login, 'POST', false);
controller.addRoute('/api/logout', services.logout, 'GET', true);	
controller.addRoute('/api/signup', services.createUser, 'POST', false);	
controller.addRoute('/api/bookmark', services.addBookmark, 'POST', true);	
controller.addRoute('/api/mybookmarks', services.myBookmarks, 'GET', true);	
controller.addRoute('/api/popular', services.popularBookmarks, 'GET', false);	
