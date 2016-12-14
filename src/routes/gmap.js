const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const fs = require('fs')


//set up google API key
let GmapsKey = process.env.GMAPS_KEY

let read = require (__dirname + '/jsonreader')
let db = require (__dirname + '/database')
let User = db.User
let Review = db.Review
let Location = db.Location

router.get('/', (req, res) => {
	console.log('index is running')
	db.Location.count()
	.then(num => {
		if (num == 0) {
			update()
		}
	}).then(
	res.render('index')
	)
})


// take locations from the database
router.get('/gpData', (req, res) => {
	db.Location.findAll({
		include: [{model: Review, include: [User]}]
	})
		.then(data => {
//			console.log(reviews)
		res.send({data: data})
	})
})

// define function to import data from geoJson file into database
let update = () => {
	read(__dirname + '/../datasets/huisartsen.json', function (data) {
		for (var i = 0; i < data.features.length; i++) {
//				console.log(locations.features[i].properties.titel)
//			locations = data
//				console.log(locations)

			db.Location.create({
				name: data.features[i].properties.titel,
				address: data.features[i].properties.adres + ', ' + data.features[i].properties.postcode + ' ' + data.features[i].properties.plaats, 
				latlong: data.features[i].geometry.coordinates,
				internet: data.features[i].properties.internet
			})
		}
	})
}

module.exports = router