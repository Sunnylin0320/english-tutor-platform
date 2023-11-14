const express = require('express')
const router = express.Router()

const studentController = require('../../controllers/student-controller')

// student 10支
router.get('/courses', studentController.getCourses) // Student查看所有Courses
router.get('/courses/:id', studentController.getCourse) // Student查看單筆Course
router.get('/:id', studentController.getStudent) // Student查看個人資料

module.exports = router
