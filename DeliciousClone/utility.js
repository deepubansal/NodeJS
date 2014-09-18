
var findIndexByAttr = function(arr, attr, value) {
	var i = arr.length;
	var foundAt = [];
	while (i--) {
		if (arr[i] && arr[i].hasOwnProperty(attr) && (arguments.length > 2 && arr[i][attr] === value)) {
			foundAt.push(i);
		}
	}
	return foundAt;
}

var removeByAttr = function(arr, attr, value) {
	var indexes = findIndexByAttr(arr, attr, value);
	if (indexes.length != 0)
		arr.splice(indexes[0], 1);
	return arr;
}

function arrayUnique(array) {
    var a = array.concat();
    for(var i=0; i<a.length; ++i) {
        for(var j=i+1; j<a.length; ++j) {
            if(a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

var guid = (function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}
	return function() {
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	};
})();

function checkPassword(users, email, password) {
	if (!email || !password) {
		return false;
	}
	for (var i = 0; i < users.length; ++i) {
		var user = users[i];
		if (user.email == email && user.password == password) {
			return true;
		}
	}
	return false;
}



exports.findIndexByAttr = findIndexByAttr;
exports.removeByAttr = removeByAttr;
exports.arrayUnique = arrayUnique;
exports.guid = guid;
exports.checkPassword = checkPassword;