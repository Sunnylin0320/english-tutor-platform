const express = require('express')
const router = express.Router()
const students = require('./modules/students')
const tutors = require('./modules/tutors')

const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')

// user 註冊登入登出7支

// admin 1支
router.use('/students', students)
router.use('/tutors', tutors)

module.exports = router
