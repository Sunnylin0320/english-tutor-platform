const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const students = require('./modules/students')
const tutors = require('./modules/tutors')

const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')

const { generalErrorHandler } = require('../middleware/error-handler')

// user 註冊登入登出7支
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signout', userController.signOut)
// admin 1支
router.get('/admin/users', adminController.getUsers)

router.use('/students', students)
router.use('/tutors', tutors)

router.use('/', (req, res) => res.redirect('/students/courses'))
router.use('/', generalErrorHandler)

module.exports = router
