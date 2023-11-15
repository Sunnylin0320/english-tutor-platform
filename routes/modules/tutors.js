const express = require('express')
const router = express.Router()
const upload = require('../../middleware/multer')

const tutorController = require('../../controllers/tutor-controller')

// tutor 3支
router.get('/:id/edit', tutorController.getTutorEdit) // Tutor查看編輯頁面
router.put('/:id/edit', upload.single('avatar'), tutorController.putTutorEdit) // Tutor編輯頁面
router.get('/:id', tutorController.getTutor) // Tutor查看個人資料

module.exports = router
