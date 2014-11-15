
var is     = require('is')
var crypto = require('crypto')





var trimCredentials = function (user) {

	return {
		username: username.trim(),
		password: password.trim()
	}

}

var makeSalt = function () {
	crypto.randomBytes(128).toString('base64')
}

// given a user object with a username and a password field,
// and possibly a salt, create the

var hashCredentials = function (user, salt, callback) {

	//100,000 rounds is secure enough.
	crypto.pbkdf2(user.password, salt, 100000, 128, function (err, derivedKey) {

		if (err) {
			// don't print call stack.
			console.log("error in pbkdf2.")
		}

		callback({
			username:   user.username,
			salt:       salt,
			derivedKey: derivedKey.toString()
		})

	})

}





var verifyLogin = function (user, callback) {

}








hashCredentials({
	username: "asdasdasd",
	password: "asdasdasd"
}, makeSalt(), console.log)
