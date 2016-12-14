//import necessary modules
const express = require('express')
const app = express()
const sequelize = require('sequelize')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')

// set views
app.set('views', __dirname + '/../views')
app.set('view engine', 'pug')

// set static folder
app.use(express.static(__dirname + '/../static'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
	secret: 'this is a not so well kept secret',
	resave: true,
	saveUninitialized: false
}))

// set up routers
let gmaps = require (__dirname + '/routes/gmap')
let db = require(__dirname + '/routes/database')
let read = require(__dirname + '/routes/jsonreader')
let review = require(__dirname + '/routes/review')
let languages = require(__dirname + '/routes/languages')
let login = require(__dirname + '/routes/login')
let reviewQuery = ""

app.use('/', gmaps)
app.use('/', review)
app.use('/', languages)
app.use('/', login)

// testroute
app.get('/ping', (req, res) => {
	res.send('pong')
})

// sync db, them listen to port 8000
db.conn.sync().then(whatever => {
	console.log('data was synced')

//	db.User.create({
//		name: "test",
//		email: "test@test",
//		password: "testtest"
//
//	})
}).then (db => {
	app.listen(8000, (req, res) => {
		console.log("the app is running on port 8000")
	})
})