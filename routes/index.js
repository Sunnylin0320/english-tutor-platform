const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const students = require('./modules/students')
const tutors = require('./modules/tutors')

const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')

const { authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')

// user 註冊登入登出7支
router.get('/signup', userController.signUpPage)
router.post('/signup', userController.signUp)
router.get('/signin', userController.signInPage)
router.post('/signin', passport.authenticate('local', { failureRedirect: '/signin', failureFlash: true }), userController.signIn)
router.get('/signout', userController.signOut)
// admin 1支
router.get('/admin/users', adminController.getUsers)

router.use('/students', authenticated, students) // students相關10支路由
router.use('/tutorts', authenticated, tutors) // tutors相關3支路由

router.use('/', generalErrorHandler)

module.exports = router
