var loggedInUsers = [];
var utility = require('./utility');

var createSession = function(email) {
	if (utility.findIndexByAttr(loggedInUsers, 'email', email).length > 0) {
		return null;
	}
	var loginInfo = {};
	loginInfo.email = email;
	loginInfo.sessionId = utility.guid();
	loggedInUsers.push(loginInfo);
	console.log(loggedInUsers);
	return loginInfo;
}

var destroySession = function(email) {
	var beforeLength = loggedInUsers.length;
	loggedInUsers = utility.removeByAttr(loggedInUsers, 'email', email);
	return loggedInUsers.length < beforeLength;
}

var getLoginInfo = function(sessionId) {
	console.log(loggedInUsers);
	var found = utility.findIndexByAttr(loggedInUsers, 'sessionId', sessionId);
	if (found.length > 0)
		return loggedInUsers[found[0]];
	else
		return null;
}


exports.createSession = createSession;
exports.destroySession = destroySession;
exports.getLoginInfo = getLoginInfo;