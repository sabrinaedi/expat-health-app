//import necessary modules
const express = require('express')
const app = express()
const sequelize = require('sequelize')
const fs = require('fs')


// set views
app.set('views', __dirname + '/../views')
app.set('view engine', 'pug')

// set static folder
app.use(express.static(__dirname + '/../static'))

// set up routers
let gmaps = require (__dirname + '/routes/gmap')
let db = require(__dirname + '/routes/database')
let read = require(__dirname + '/routes/jsonreader')

app.use('/', gmaps)

// testroute
app.get('/ping', (req, res) => {
	res.send('pong')
})


// sync db, them listen to port 8000
db.conn.sync({force:true}).then(db => {
	console.log('data was synced')
}).then (db => {
	app.listen(8000, (req, res) => {
		console.log("the app is running on port 8000")
	})
})