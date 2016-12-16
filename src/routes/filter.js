const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const fs = require('fs')
const bodyParser = require('body-parser')

let db = require(__dirname + '/database')
let Review = db.Review
let User = db.User
let Location = db.Location

router.post('/searchLang', (req, res) => {
//	console.log(req.body.language)
	if (req.body.language == "Show All") {
			db.Location.findAll({
			include: [{
				model: Review,
				include: [User]
			}]
		}). then ( data => {
//			console.log(data)
			res.send({data: data})
		})
	} else {
//		console.log(req.body.language)
		db.Location.findAll({
			include: [{
				model: Review,
				include: [User],
				where: {
					language: req.body.language
				}
			}]
		}). then ( data => {
//			console.log(data)
			res.send({data: data})
		})
	}
})

module.exports = router