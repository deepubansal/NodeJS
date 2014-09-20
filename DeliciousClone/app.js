var server = require('./server');
var controller = require('./controller');
var services = require('./services');

server.start(controller.getRoute);

controller.addRoute('/api/login', services.login, 'POST');
controller.addRoute('/api/logout', services.logout, 'POST');	
controller.addRoute('/api/signup', services.createUser, 'POST');	
controller.addRoute('/api/bookmark', services.addBookmark, 'POST');	
controller.addRoute('/api/mybookmarks', services.myBookmarks, 'POST');	
controller.addRoute('/api/popular', services.popularBookmarks, 'GET');	
