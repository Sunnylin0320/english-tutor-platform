const express = require('express')
const router = express.Router()

const studentController = require('../../controllers/student-controller')

// student 10支
router.get('/courses', studentController.getCourses) // User查看所有Courses
router.get('/courses/:id', studentController.getCourse) // User查看單筆Course

module.exports = router
