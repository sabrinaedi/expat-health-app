//import necessary modules
const express = require('express')
const app = express()
const sequelize = require('sequelize')

// set views
app.set('views', __dirname + '/../views')
app.set('view engine', 'pug')

// set static folder
app.use(express.static(__dirname + '/../static'))

// set up routers

//set up google API key
let GmapsKey = process.env.GMAPS_KEY

// set up database
let db = new sequelize('expathealth', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	server: 'localhost',
	dialect: 'postgres'
})

// define database models
let User = db.define('users', {
	name: sequelize.STRING,
	email: sequelize.STRING,
	password: sequelize.STRING
})

let Location =  db.define('locations', {
	name: sequelize.STRING,
	address: sequelize.STRING,
	latitude: sequelize.STRING,
	longitude: sequelize.STRING,
	type: sequelize.STRING
})

let Review = db.define('reviews', {
	language: sequelize.STRING,
	ehic: sequelize.STRING, 
	rating: sequelize.INTEGER,
	comment: sequelize.TEXT
})

// define relations
User.hasMany(Review)
Location.hasMany(Review)
Review.belongsTo(Location)
Review.belongsTo(Review)


// testroute
app.get('/ping', (req, res) => {
	res.send('pong')
})

app.get('/', (req, res) => {
	res.render('index')
})


// sync db, them listen to port 8000
db.sync({force:true}).then(db => {
	console.log('data was synced')
}).then (db => {
	app.listen(8000, (req, res) => {
		console.log("the app is running on port 8000")
	})
})