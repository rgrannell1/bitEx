#!/usr/bin/env node

var request = require("request")


var getBitcoinRate = function (callback) {

	request('https://api.bitcoinaverage.com/ticker/EUR/', function (err, res, body) {

		if (err) {
			console.log("getBitcoinRate:" + JSON.stringify(err))
		}

		// todo set application content type instead.
		body = JSON.parse(body)

		callback({
			price: body.last,
			time:  (new Date).getTime()

		})

	})
}
