
var is     = require('./is')
var crypto = require('crypto')









// remove whitespace from the input user credentials.

var trimCredentials = function (user) {

	return {
		username: username.trim(),
		password: password.trim()
	}

}

// return a random salt.

var makeSalt = function () {
	return crypto.randomBytes(128).toString('base64')
}

// given a user object with a username and a password field,
// and possibly a salt, create the

var hashCredentials = function (user, salt, callback) {

	const rounds = 100000    //100,000 rounds is secure enough.

	crypto.pbkdf2(user.password, salt, rounds, 128, function (err, derivedKey) {

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





var isRegistered = function (user, callback) {
	callback(true) // hard coded
}

//

var lookupUser = function (user, callback) {

	callback({
		user: 'bob',
		password: '789232347924789234237894237894243mbh',
		salt: '0'
	})

}





// check if a user is registered, and compare their
// hash against the hash in the database.

var verifyLogin = function (user, callback) {

	// is the user in the database?
	isRegistered(user, function (isFound) {

		if (!isFound) {
			callback(false)
		} else {

			lookupUser(user, function (realCredentials) {

				// check if the suppied credentials hash to the
				// users actual stored hash.

				// === is insecure way of comparing.
				hashCredentials(user, realCredentials.salt, function (cred) {
					callback(cred.password === realCredentials.password)
				})

			})

		}
	})
}








var user = {
	username: "bob",
	password: "password12345"
}

// given the user's password and username.
// check if the user is in the database, and that he or she
// used the correct login credentials.
//
// if they did, call the success callback on their credentials. If the
// credentials were bad, call the failure callback on their credentials.

var signin = function (user, success, failure) {

	verifyLogin(user, function (isValid) {
		isValid ? success(user): failure(user)
	})

}




signin(user, console.log, console.log)
