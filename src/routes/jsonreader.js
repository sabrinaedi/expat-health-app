const fs = require('fs')

function read (filename, callback) {
	fs.readFile(filename, 'utf8', (err, data) => {
		if (err) throw err
			callback(JSON.parse(data))
	})
}

module.exports = read