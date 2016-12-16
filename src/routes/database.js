const sequelize = require('sequelize')
const fs = require('fs')

// set up database
let db = new sequelize('expathealth', process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
	server: 'localhost',
	dialect: 'postgres'
})

// define database models
let User = db.define('users', {
	name: {
		type: sequelize.STRING,
		allowNull: false,
		unique: true,
		validate: {
			len: [3, 20]
		}
	},
	email: {
		type: sequelize.STRING,
		allowNull: false,
		unique: true
	},
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
Review.belongsTo(User)

module.exports = {
	conn: db,
	User: User,
	Location: Location,
	Review: Review
}