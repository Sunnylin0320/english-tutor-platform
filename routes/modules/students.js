const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const studentController = require('../../controllers/student-controller')

// student 10支
router.get('/courses', studentController.getCourses) // Student查看所有Courses
router.get('/courses/:id', studentController.getCourse) // Student查看單筆Course
router.post('/courses/:id', studentController.postCourse) // Student對單筆Course做booking
router.get('/:id/apply', studentController.getApplyTutor) // Student查看成為老師頁面
router.post('/:id/apply', studentController.postApplyTutor) // Student申請成為老師
router.get('/:id/edit', studentController.getStudentEdit) // Student查看編輯頁面
router.put('/:id/edit', upload.single('avatar'), studentController.putStudentEdit) // Student編輯頁面
router.get('/:id/comment', studentController.getComment)
router.get('/:id', studentController.getStudent) // Student查看個人資料

module.exports = router
