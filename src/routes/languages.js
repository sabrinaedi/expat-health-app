const express = require('express')
const router = express.Router()
const sequelize = require('sequelize')
const fs = require('fs')
const languages = require('languages')

let db = require (__dirname + '/database')

let langscodes = languages.getAllLanguageCode()
let allLanguages = []

for (num_languages=0; num_languages<langscodes.length; num_languages++) {
  // show a string representation of the object return by languages.getLanguageInfo(langcode) 
//    console.log(langscodes[num_languages]);
    allLanguages.push(languages.getLanguageInfo(langscodes[num_languages]));
}

router.get('/getLanguage', (req, res) => {
	let languageNames = []
	for (var i = 0; i<allLanguages.length; i++) {
		languageNames.push(allLanguages[i].name)
	}
//	console.log(languageNames)
	res.send(languageNames)
})

//console.log(allLanguages)

module.exports = router