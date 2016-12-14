const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const fs = require('fs')
const bodyParser = require('body-parser')
const session = require('express-session')

let db = require(__dirname + '/database')


router.post('/login/user', (req, res) => {

//	console.log(req.body.logineEmail)
	db.User.findOne({
		where: {
			email: req.body.loginEmail
		}
	}).then ( user => {
		req.session.user = user
//		console.log(user)
		res.redirect('/')
	})
})

// route for logout function
router.get('/logout', (req, res) => {
	console.log('was logged out')
	delete req.session.user
	res.send('you successfully logged out')
})

module.exports = router