var jf = require('jsonfile');
var httpHelper = require('./httpHelper');
var utility = require('./utility')
var usersFile = 'data/users.data'
var bookmarksFile = 'data/bookmarks.data'

var users = [];
var loggedInUsers = [];
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

var login = function(response, postData, queryData) {
	var loginInfo = {};
	if (utility.checkPassword(users, postData['email'], postData['password'])) {
		loginInfo.email = postData['email'];
		loginInfo.sessionId = utility.guid();
		loggedInUsers.push(loginInfo);
		httpHelper.sendSuccess(response, JSON.stringify(loginInfo));
	} else {
		httpHelper.sendError(response, 403, "Invalid Username or password")
	}
	console.log(loggedInUsers);
}

var logout = function(response, postData, queryData) {
	var beforeLength = loggedInUsers.length;
	console.log(postData.sessionId)
	loggedInUsers = utility.removeByAttr(loggedInUsers, 'sessionId', postData.sessionId);
	if (loggedInUsers.length < beforeLength)
		httpHelper.sendSuccess(response, "Logged Out Successfully");
	else
		httpHelper.sendError(response, 400, "Session Invalid");
	console.log(loggedInUsers);
}

var createUser = function(response, postData, queryData) {
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
		}
		else {
			httpHelper.sendError(response, 400, "Bad Request: A user with this email is already registered.")
		}
	}
}

var addBookmark = function(response, postData, queryData) {
	if (postData.sessionId == undefined || postData.bookmark == undefined) {
		console.log('Bad request: ' + postData);
		httpHelper.sendError(response, 400, "Bad Request: Invalid bookmark or session.")
	} else {
		var ind = utility.findIndexByAttr(loggedInUsers, 'sessionId', postData['sessionId']);
		if (ind.length != 0) {
			var bookmark = {}
			bookmark.url = postData.bookmark;
			if (postData.tags instanceof Array) {
				bookmark.tags = postData.tags;
			}
			else {
				bookmark.tags = postData.tags.replace(' ,', ',').replace(', ', ',').split(',');
			}
			bookmark.by = loggedInUsers[ind[0]].email;
			bookmarks.push(bookmark);
			jf.writeFile(bookmarksFile, bookmarks, function(err) {
				console.log(err)
			});
			httpHelper.sendSuccess(response, JSON.stringify(bookmark));
		} else
			httpHelper.sendError(response, 403, "Invalid session. Try logging in again");
	}
}

var myBookmarks = function(response, postData, queryData) {
	if (postData.sessionId == undefined) {
		console.log('Bad request: ' + postData);
		httpHelper.sendError(response, 403, "Invalid session. Try logging in again");
	} else {
		var ind = utility.findIndexByAttr(loggedInUsers, 'sessionId', postData['sessionId']);
		if (ind.length != 0) {
			var bookmarkIndexes = utility.findIndexByAttr(bookmarks, 'by', loggedInUsers[ind[0]].email);
			var myBookmarks = [];
			for (var i = 0; i < bookmarkIndexes.length; ++i) {
				myBookmarks.push(bookmarks[bookmarkIndexes[i]]);
			}
			httpHelper.sendSuccess(response, JSON.stringify(myBookmarks));
		} else
			httpHelper.sendError(response, 403, "Invalid session. Try logging in again");
	}
}

var allBookmarks = function(response, postData, queryData) {
	if (postData.sessionId == undefined) {
		console.log('Bad request: ' + postData);
		httpHelper.sendError(response, 403, "Invalid session. Try logging in again");
	} else {
		var ind = utility.findIndexByAttr(loggedInUsers, 'sessionId', postData['sessionId']);

		if (ind.length != 0) {
			var groupedBookMarks = [];
			for (var i = 0; i < bookmarks.length; ++i) {
				var currentGroup = utility.findIndexByAttr(groupedBookMarks, 'url', bookmarks[i].url);
				if (currentGroup.length == 0) {
					var groupBookmark = {};
					groupBookmark.url = bookmarks[i].url;
					groupBookmark.tags = bookmarks[i].tags;
					groupBookmark.count = 1;
					groupedBookMarks.push(groupBookmark);
				}
				else {
					var groupBookmark = groupedBookMarks[currentGroup[0]];
					groupBookmark.count++;
					groupBookmark.tags = utility.arrayUnique(groupBookmark.tags.concat(bookmarks[i].tags));
				}
			}
			groupedBookMarks.sort(function(a,b){return b.count - a.count});
			httpHelper.sendSuccess(response, JSON.stringify(groupedBookMarks));
		} else
			httpHelper.sendError(response, 403, "Invalid session. Try logging in again");
	}
}


exports.login = login;
exports.logout = logout;
exports.createUser = createUser;
exports.addBookmark = addBookmark;
exports.myBookmarks = myBookmarks;
exports.allBookmarks = allBookmarks;