var server = require('./server');
var controller = require('./controller');
var services = require('./services');

server.start(controller.getRoute);

controller.addRoute('/login', services.login);
controller.addRoute('/logout', services.logout);	
controller.addRoute('/signup', services.createUser);	
controller.addRoute('/bookmark', services.addBookmark);	
controller.addRoute('/mybookmarks', services.myBookmarks);	
controller.addRoute('/', services.allBookmarks);	
