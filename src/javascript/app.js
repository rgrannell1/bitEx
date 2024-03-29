#!/usr/bin/env node

var express = require("express")
var cookieParser = require("cookie-parser")
var bodyParser = require("body-parser")
var multer = require('multer')

var request = require("request")
var crypto  = require('crypto')
var express  = require('express')

// service module
var app = express()

// parse request body data
app.use(bodyParser.json()) // parse json
app.use(bodyParser.urlencoded({ extended: true })) // x-www-form-urlencoded
app.use(multer()) // parse form data

// store user sessions
app.use(cookieParser("dsjsadjsadljasldsfjsaautdeayu"))



// get the current exchange rate for bitcoin in euros per bitcoin.

var getBitcoinRate = function (callback) {

	request('https://api.bitcoinaverage.com/ticker/EUR/', function (err, res, body) {

		if (err) {
			throw err
		}

		// TODO set content-type header instead of this crap.
		body = JSON.parse(body)

		callback({
			price: parseFloat(body.last, 10),
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

var views = (function() {

	var base = __dirname + '/views'

	return {
		'index': base + '/index.html',
		'dashboard': base + '/dashboard.html'
	}

})()


var user = {
	'email': 'spendthrift@example.com',
	'password': 'dollah'
}

var purchase = sale = {
	'type': 'euro',
	'quantity': 75
}



var databaseBuy = function (user, purchase, callback) {
	// move coin around, deduct balances.
	callback("something happened.")
}

var databaseSell = function (user, sale, callback) {
	// move coin around, deduct balances.
	callback("something else happened.")
}

var buy = function (user, purchase, callback) {

	if (purchase.type === 'euro') {

		getBitcoinRate(function (rate) {

			var euros  = purchase.quantity
			var quantity = euros / rate.price // bitcoin can be a float.

			databaseBuy(user, {
				quantity: quantity
			}, callback)

		})

	} else if (purchase.type === 'bitcoin') {

		getBitcoinRate(function (rate) {

			var quantity = purchase.quantity
			var euros  = quantity * rate.price

			// do something with price.

			databaseBuy(user, {
				quantity: quantity
			}, callback)
		})


	} else {
		throw Error("unknown type.")
	}

}





var sell = function (user, sale, callback) {

	if (sale.type === 'euro') {

		getBitcoinRate(function (rate) {

			var euros  = sale.quantity
			var quantity = euros / rate.price // bitcoin can be a float.

			databaseSell(user, {
				quantity: quantity
			}, callback)

		})

	} else if (sale.type === 'bitcoin') {

		getBitcoinRate(function (rate) {

			var quantity = sale.quantity
			var euros  = quantity * rate.price

			// do something with price (send to UI)

			databaseSell(user, {
				quantity: quantity
			}, callback)
		})


	} else {
		throw Error("unknown type.")
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
	return crypto.randomBytes(16).toString('base64')
}

// given a user object with a email and a password field,
// and possibly a salt, create the

var hashCredentials = function (user, salt, callback) {

	var rounds = 100000    //100,000 rounds is secure enough.

	crypto.pbkdf2(user.email, salt, rounds, 16, function (err, derivedKey) {

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
		email: 'bob@gmail.com',
		hash: '789232347924789234237894237894243mbh',
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
					//callback(cred.email === realCredentials.email)
					callback(true);
				})

			})

		}
	})

}

// CREATE SESSION FOR THE USER SIGN IN
// TODO: could this be stored on server with reference?
var createUserSession = function(user, res) {
	res.cookie('user', user, { 'signed': true })
}


// VERIFY USER SESSION HAS BEEN SET
var hasUserSession = function(req) {
	return !!req.signedCookies.user
}



// HANDLE FOR VALIDATING USER CREDENTIALS.
//
// check if the user is in the database, and that he or she
// used the correct login credentials.
//
// if they did, call the success callback on their credentials. If the
// credentials were bad, call the failure callback on their credentials.

var signin = function (user, reqRes, success, failure) {

	verifyLogin(user, function (isValid) {

		createUserSession(user, reqRes.res)

		if(isValid) {
			success(user, reqRes)
		} else {
			failure(user, reqRes)
		}
	})

}

var register = function (user, res, success, failure) {
	// TODO
}

// VIEW RESOLVERS FOR SIGNIN
var signinView = ( function() {

	var failure = function(user, reqRes) {
		reqRes.res.redirect('/')
	}

	var success = function(user, reqRes) {
		reqRes.res.redirect('/dashboard')
	}

	return {
		'failure': failure,
		'success': success
	}

} )()


// VIEW RESOLVERS FOR SIGNIN
var registerView = ( function() {

	var success = function(user, res) {
		return 'success';
	}

	var failure = function(user, res) {
		return 'failure';
	}

	return {
		'failure': failure,
		'success': success
	}

} )()




/*****************************************************/
//
//					Client API
//
/******************************************************/

// SIGN IN REQUEST FROM CLIENT
//
// takes the clients email & password
// atempts to log them into the system
app.post('/signin', function(req, res) {

	var credentials = req.body

	var user = {
		'email': credentials.email,
		'password': credentials.password
	}

	var reqRes = {
		'req': req,
		'res': res
	}

	signin(user, reqRes, signinView.success, signinView.failure)
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

// home page / promo page view
app.get('/', function(req, res) {

	if(hasUserSession(req)) {
		res.redirect('/dashboard')
	} else {
		res.sendFile(views.index)
	}
})

// user dashboard for buy, sell & withdraw actions
app.get('/dashboard', function(req, res) {

	if(true) {
		res.sendFile(views.dashboard)
	} else {
		res.redirect('/')
	}
})

// load resources such as js, css & image files
app.get('/resources/:type/:sub/:file', function(req, res) {

	var params = req.params
	var dPath = params.type + '/' + params.sub + '/' + params.file

	res.sendFile(__dirname + '/client/resources/' + dPath)
})

// angular templates
app.get('/templates/:file', function(req, res) {
	res.sendFile(__dirname + '/views/templates/' + req.params.file)
})

//buy(user, purchase, console.log)
//sell(user, sale, console.log)

app.post('buy', function(req, res) {

	// user id
	var purchase = req.body.purchase

	/// buy(user, purchase, console.log)

	res.send('0.0161')
})

// TO SIGN IN PAGE
app.get('/signin', function(req, res) {
	res.sendFile(__dirname + '/views/signin.html')
})


buy(user, purchase, console.log)
sell(user, sale, console.log)



// BUY / SELL conversions
app.get('/toBTC/:quantity', function(req, res) {
	getBitcoinRate(function (rate) {
			var amount = req.params.quantity / rate.price

			console.log(amount)

			res.json({ 'amount' : amount })
	})
})

app.get('/toEUR/:quantity', function(req, res) {
	getBitcoinRate(function (rate) {
			var amount = req.params.quantity * rate.price
			res.json({ 'amount' : amount })
	})
})


app.listen(8080)
console.log("listening on port 8080")
