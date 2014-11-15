#!/usr/bin/env node

var express = require("express")
var bodyParser = require("body-parser")

var request = require("request")
var crypto  = require('crypto')
var express  = require('express')

// service module
var app = express()

// parse request body data
app.use(bodyParser.json())



// get the current exchange rate for bitcoin in euros per bitcoin.

var getBitcoinRate = function (callback) {

	request('https://api.bitcoinaverage.com/ticker/EUR/', function (err, res, body) {

		if (err) {
			throw err
		}

		// TODO set content-type header instead of this crap.
		body = JSON.parse(body)

		callback({
			price: body.last,
			time:  (new Date).getTime()
		})

	})
}






var a = function (str, val) {
	return Object.prototype.toString.call(val).toLowerCase() ===
		"[object " + str.toLowerCase() + "]"
}




var is = {
	'a': a,
	'array':  function (val) {
		return a('array', val)
	},
	'boolean': function (val) {
		return a('boolean', val)
	},
	'date': function (val) {
		return a('date', val)
	},
	'error': function (val) {
		return a('error', val)
	},
	'function': function (val) {
		return a('function', val)
	},
	'null': function (val) {
		return a('null', val)
	},
	'number': function (val) {
		return a('number', val)
	},
	'object': function (val) {
		return a('object', val)
	},
	'regexp': function (val) {
		return a('regexp', val)
	},
	'string': function (val) {
		return a('string', val)
	},
	'undefined': function (val) {
		return a('undefined', val)
	},
	'what': function (val) {
		return Object.prototype.toString.call(val).toLowerCase().slice(8, -1)
	}
}














// remove whitespace from the input user credentials.

var trimCredentials = function (user) {

	return {
		email: email.trim(),
		password: password.trim()
	}

}

// return a random salt.

var makeSalt = function () {
	return crypto.randomBytes(128).toString('base64')
}

// given a user object with a email and a password field,
// and possibly a salt, create the

var hashCredentials = function (user, salt, callback) {

	var rounds = 100000    //100,000 rounds is secure enough.

	crypto.pbkdf2(user.email, salt, rounds, 128, function (err, derivedKey) {

		if (err) {
			throw err
		}

		callback({
			email: user.email,
			salt: salt,
			derivedKey: derivedKey.toString()
		})

	})

}



// Make a call to the database to check if the user
// is registered.

var isRegistered = function (user, callback) {
	callback(true) // hard coded
}

// Return the database row containing a particular email.

var lookupUser = function (user, callback) {

	callback({
		user: 'bob',
		email: '789232347924789234237894237894243mbh',
		salt: '0'
	})

}





// check if a user is registered, and compare their
// hash against the hash in the database. Return a boolean
// denoting if they are signed up / gave the correct credentials.

var verifyLogin = function (user, callback) {

	// is the user in the database?
	isRegistered(user, function (isFound) {

		if (!isFound) {
			callback(false)
		} else {

			lookupUser(user, function (realCredentials) {

				// check if the suppied credentials hash to the
				// users actual stored hash.

				// === is insecure way of comparing (timing attacks).
				hashCredentials(user, realCredentials.salt, function (cred) {
					callback(cred.email === realCredentials.email)
				})

			})

		}
	})

}




// HANDLE FOR VALIDATING USER CREDENTIALS.
//
// check if the user is in the database, and that he or she
// used the correct login credentials.
//
// if they did, call the success callback on their credentials. If the
// credentials were bad, call the failure callback on their credentials.

var signin = function (user, res, success, failure) {

	verifyLogin(user, function (isValid) {
		isValid ? success(res, user): failure(res, user)
	})

}

var register = function (user, res, success, failure) {
	// TODO
}

// VIEW RESOLVERS FOR SIGNIN
var signinView = ( function() {

	var success = function(res, user) {
		return 'success';
	}

	var failure = function(res, user) {
		return 'failure';
	}

	return {
		'failure': failure,
		'success': success
	}

} )()

// VIEW RESOLVERS FOR SIGNIN
var registerView = ( function() {

	var success = function(res, user) {
		return 'success';
	}

	var failure = function(res, user) {
		return 'failure';
	}

	return {
		'failure': failure,
		'success': success
	}

} )()


// SIGN IN REQUEST FROM CLIENT
//
// takes the clients email & password
// atempts to log them into the system
app.post('/signin', function(req, res) {

	var credentials = req.body;

	var user = {
		'email': credentials.email,
		'password': credentials.password
	}

	signin(user, res, signinView.success, signinView.failure)
})

// REGISTRATION REQUEST FROM CLIENT
//
// takes the clients email & password
// atempts to log them into the system
app.post('/register', function(req, res) {

	var credentials = req.body;

	var user = {
		'legalName': credentials.legalName,
		'email': credentials.email,
		'password': credentials.password
	}

	register(user, res, registerView.success, registerView.failure)
})

app.listen(8080)
console.log("listening on port 8080")





























var user = {
	'email': 'spendthrift@example.com',
	'password': 'dollah'
}

var purchase = {
	'type': 'euro',
	'quantity': 100
}





var buy = function (user, purchase, callback) {

	if (purchase.type === 'euro') {

		getBitcoinRate(function (rate) {

			var euros  = purchase.quantity
			var amount = euros / rate // bitcoin can be a float.

			console.log(amount)

		})

	} else if (purchase.type === 'bitcoin') {

		getBitcoinRate(function (rate) {

			var amount = purchase.quantity
			var euros  = amount * rate

			console.log(amount)

		})


	} else {
		throw Error("unknown type.")
	}

}

var sell = function (user, sale, callback) {

}





buy(user, purchase, console.log)