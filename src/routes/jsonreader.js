const express = require('express')
const router = express.Router()
const fs = require('fs')

function read (filename, callback) {
	fs.readFile(filename, 'utf8', (err, data) => {
		if (err) throw err
			callback(JSON.parse(data))
	})
}

module.exports = read