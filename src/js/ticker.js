#!/usr/bin/env node





var http = require("http")
var https = require("https")
var request = require("request")




var getBitcoinRate = function () {

	request('https://www.bitstamp.net/api/ticker', function (err, res, body) {

		if (err) {
			console.log("getBitcoinRate: ")
		}

		if (res.statusCode === 200) {
			return {
				price: body.last,
			}
		}

	})
}






console.log(getBitcoinRate())

