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
let read = require (__dirname + '/routes/jsonreader')
let gmaps = require (__dirname + '/routes/gmap')


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
	internet: sequelize.STRING,
	latlong: sequelize.ARRAY(sequelize.STRING),
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
	console.log('index is running')

	Location.count()
	.then(num => {
		if (num == 0) {
			update()
		}
	}).then(
	res.render('index')
	)
})


// let locations 

app.post('/gpData', (req, res) => {
	
	Location.findAll()
	.then(data => {
		console.log(data)
		res.send(data)
	})	
})

let update = () => {
	read(__dirname + '/datasets/huisartsen.json', function (data) {
		for (var i = 0; i < data.features.length; i++) {
//				console.log(locations.features[i].properties.titel)
//			locations = data
//				console.log(locations)

			Location.create({
				name: data.features[i].properties.titel,
				address: data.features[i].properties.adres + ', ' + data.features[i].properties.postcode,
				latlong: data.features[i].geometry.coordinates,
				internet: data.features[i].properties.internet
			})
		}
	})
}
//	res.send(locations)

//	}).then( locations => {


//	res.send(locations)


//	read(__dirname + '/datasets/huisartsen.json', function (data) {
//		let locations = data
//		console.log(locations)
//		}).then( locations => {
//			Location.count()
//		 }).then(num => {
//			if (num == 0) {
//				for (var i = 0; i < locations.features.length; i++) {
//					console.log(locations.features[i].properties.titel)
//					Location.create({
//						name: locations.features[i].properties.titel,
//						address: locations.features[i].properties.adres + ', ' + locations.features[i].properties.postcode,
//						latlong: locations.features[i].geometry.coordinates
//					})
//				}
//			}
//		}).then (res => {
//			res.send(locations)
//		})



// sync db, them listen to port 8000
db.sync({force:true}).then(db => {
	console.log('data was synced')
}).then (db => {
	app.listen(8000, (req, res) => {
		console.log("the app is running on port 8000")
	})
})