var jf = require('jsonfile');
var httpHelper = require('./httpHelper');
var utility = require('./utility')
var sessionManager = require('./sessionManager')
var usersFile = 'data/users.data'
var bookmarksFile = 'data/bookmarks.data'

var users = [];
var bookmarks = [];

jf.readFile(usersFile, function(err, obj) {
	if (err)
		console.log('Error reading "users.data" file' + err)
	else {
		console.log(obj)
		users = obj;
	}
});

jf.readFile(bookmarksFile, function(err, obj) {
	if (err)
		console.log('Error reading "bookmarks.data" file' + err)
	else {
		bookmarks = obj;
	}
});

var login = function(response, data) {
	var postData = data.postData;
	if (utility.checkPassword(users, postData['email'], postData['password'])) {
		var loginInfo = sessionManager.createSession(postData.email);
		if (loginInfo)
			httpHelper.sendSuccess(response, JSON.stringify(loginInfo));
		else
			httpHelper.sendError(response, 403, "User is already Logged In");
	} else {
		httpHelper.sendError(response, 403, "Invalid Username or password")
	}
}

var logout = function(response, data) {
	if (sessionManager.destroySession(data.loginInfo.email))
		httpHelper.sendSuccess(response, "Logged Out Successfully");
	else
		httpHelper.sendError(response, 400, "Session Invalid");
}

var createUser = function(response, data) {
	var postData = data.postData;
	if (postData.email == undefined || postData.password == undefined) {
		console.log('Bad request: ' + postData);
		httpHelper.sendError(response, 400, "Bad Request: Email and password are mandatory.")
	} else {
		if (utility.findIndexByAttr(users, 'email', postData.email).length == 0) {
			var user = {};
			user.email = postData.email;
			user.password = postData.password;
			users.push(user);
			jf.writeFile(usersFile, users, function(err) {
				console.log(err)
			});
			httpHelper.sendSuccess(response, JSON.stringify(user));
		} else {
			httpHelper.sendError(response, 400, "Bad Request: A user with this email is already registered.")
		}
	}
}

var addBookmark = function(response, data) {
	var postData = data.postData;
	if (postData.bookmark == undefined) {
		console.log('Bad request: ' + postData);
		httpHelper.sendError(response, 400, "Bad Request: Invalid bookmark.")
	} else {
		var bookmark = {}
		bookmark.url = postData.bookmark;
		if (postData.tags instanceof Array)
			bookmark.tags = postData.tags;
		else
			bookmark.tags = postData.tags.replace(' ,', ',').replace(', ', ',').split(',');
		bookmark.by = data.loginInfo.email;
		bookmarks.push(bookmark);
		jf.writeFile(bookmarksFile, bookmarks, function(err) {
			console.log(err)
		});
		httpHelper.sendSuccess(response, JSON.stringify(bookmark));
	}
}

var myBookmarks = function(response, data) {
	var bookmarkIndexes = utility.findIndexByAttr(bookmarks, 'by', data.loginInfo.email);
	var myBookmarks = [];
	for (var i = 0; i < bookmarkIndexes.length; ++i)
		myBookmarks.push(bookmarks[bookmarkIndexes[i]]);
	httpHelper.sendSuccess(response, JSON.stringify(myBookmarks));
}

var popularBookmarks = function(response, data) {
	var groupedBookMarks = [];
	for (var i = 0; i < bookmarks.length; ++i) {
		var currentGroup = utility.findIndexByAttr(groupedBookMarks, 'url', bookmarks[i].url);
		if (currentGroup.length == 0) {
			var groupBookmark = {};
			groupBookmark.url = bookmarks[i].url;
			groupBookmark.tags = bookmarks[i].tags;
			groupBookmark.count = 1;
			groupedBookMarks.push(groupBookmark);
		} else {
			var groupBookmark = groupedBookMarks[currentGroup[0]];
			groupBookmark.count++;
			groupBookmark.tags = utility.arrayUnique(groupBookmark.tags.concat(bookmarks[i].tags));
		}
	}
	groupedBookMarks.sort(function(a, b) {
		return b.count - a.count
	});
	httpHelper.sendSuccess(response, JSON.stringify(groupedBookMarks));
}

var checkAuthentication = function(request, response) {
	var sessionId = httpHelper.getSessionIdFromHeader(request);
	console.log('sessionId from header' + sessionId);
	if (sessionId) {
		var loginInfo = sessionManager.getLoginInfo(sessionId);
		console.log(loginInfo)
		if (loginInfo)
			return loginInfo;
	}
	return null;
}


exports.login = login;
exports.logout = logout;
exports.createUser = createUser;
exports.addBookmark = addBookmark;
exports.myBookmarks = myBookmarks;
exports.popularBookmarks = popularBookmarks;
exports.checkAuthentication = checkAuthentication;