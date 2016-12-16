const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')

let db = require (__dirname + '/database')

let User = db.User
let Review = db.Review
let Location = db.Location

router.get('/review/new', (req, res) => {
	if (req.session.user == undefined) {
		res.send('Please log in or sign up to add a review')
	} else {
		reviewQuery = req.query.id
		db.Location.findOne({
			where: {
				id: req.query.id
			}
		}).then (location => {
			res.render('review', {
				data: location
			})
		})
	}
})

router.post('/addReview', (req, res) => {
	console.log('postworked')

//	console.log(req.body.inputComment)
//	console.log(req.body.group1)
//	console.log(req.body.group2)
//	console.log(req.body.languages)
	if (req.body.languages !== undefined && req.body.group1 !== undefined && req.body.group2 !== undefined) {

	User.findOne({
		where: {
			email: req.session.user.email
		}
	}). then ( user => {
		user.createReview({
			language: req.body.languages,
			ehic: req.body.group2,
			rating: req.body.group1,
			comment: req.body.inputComment
		}). then (review  => {
			Location.findOne({
				where: {
					id: reviewQuery
				}
			}).then ( location => {
				review.setLocation(location)
			})
		})

	}).then ( user => {
	res.redirect('/')
	})
	} else {
		res.redirect('/addReview?message=' + encodeURIComponent("Please fill in all the required fields"))
	}
})

module.exports = router