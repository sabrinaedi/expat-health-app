const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')
const bcrypt = require('bcrypt-nodejs')

let db = require(__dirname + '/database')
let Review = db.Review
let User = db.User
let Location = db.Location

router.get('/register', (req, res) => {
	res.render('register')
})

router.post('/users', (req, res) => {
	if (req.body.inputPassword.length>7 && req.body.inputName.length>3) {
		User.count ( {
			where: sequelize.or(
				{ email: req.body.inputEmail},
				{ name: req.body.inputName }
			)
		} ).then( num => {
			if ( num > 0 ) {
				res.redirect('/users?message=' + encodeURIComponent("username or email already exists"))
			} else {
				bcrypt.hash(req.body.inputPassword, null, null, (err, hash) => {
					User.create({
						name: req.body.inputName,
						email: req.body.inputEmail,
						password: hash
					}).then (user => {  
						req.session.user = user
					}).then (user => {
						res.redirect('/')
					})
				})
			}
		})
	}
})


module.exports = router