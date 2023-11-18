const { Op } = require('sequelize')
const Sequelize = require('sequelize')
const { User, Course, Booking, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helpers')
const { imgurFileHandler } = require('../helpers/file-helpers')

const studentController = {
  getCourses: (req, res, next) => {
    const keyword = req.query.keyword || ''
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Course.findAndCountAll({ include: User, limit, offset, raw: true, nest: true })
      .then(coursesAll => {
        const courses = coursesAll.rows.filter(course =>
          course.name.toLowerCase().includes(keyword.toLowerCase()) || course.User.name.toLowerCase().includes(keyword.toLowerCase())
        )
        res.render('students/courses', {
          courses,
          keyword,
          pagination: getPagination(limit, page, courses.count)
        })
      })
      .catch(err => next(err))
  },
  getCourse: async (req, res, next) => {
    try {
      const { id } = req.params
      const course = await Course.findByPk(id, {
        include: [
          {
            model: User
          }
        ],
        raw: true,
        nest: true
      })
      if (!course) {
        throw new Error('課程不存在')
      }

      const periods = ['18:00', '19:00', '20:00']

      res.render('students/course', {
        course,
        periods
      })
    } catch (err) {
      next(err)
    }
  },
  postCourse: async (req, res, next) => {
    try {
      const courseId = req.params.id
      const studentId = req.user.id

      const course = await Course.findByPk(courseId)
      if (!course) {
        throw new Error('課程不存在！')
      }

      const newBooking = await Booking.create({
        CourseId: courseId,
        StudentId: studentId,
        period: '60分鐘',
        createdAt: new Date(),
        updatedAt: new Date()
      })

      if (newBooking) {
        const tutor = await Course.findOne({
          where: { id: courseId },
          include: [User],
          raw: true,
          nest: true
        })

        req.flash('success_messages', '已成功預約課程!')
        res.redirect('/')
      } else {
        res.json({ success: false, message: '預約失敗' })
      }
    } catch (err) {
      next(err)
    }
  },
  getStudent: async (req, res, next) => {
    try {
      const id = req.params.id
      const student = await User.findByPk(id, { raw: true })

      if (!student) {
        throw new Error("User doesn't exist.")
      }
      const newBookings = await Booking.findAll({
        where: {
          StudentId: id,
          createdAt: { [Sequelize.Op.gt]: new Date('2023-11-01') }
        },
        include: [
          {
            model: Course,
            include: [{ model: User }]
          }
        ],
        nest: true,
        raw: true
      })
      const lessonHistory = await Booking.findAll({
        where: {
          StudentId: id,
          createdAt: { [Op.lt]: new Date() }
        },
        include: [
          {
            model: Course,
            attributes: ['name', 'link'],
            include: [{ model: User }]
          }
        ],
        nest: true,
        raw: true
      })
      res.render('students/profile', {
        student,
        newBookings,
        lessonHistory
      })
    } catch (err) {
      next(err)
    }
  },

  getStudentEdit: async (req, res, next) => {
    try {
      const id = req.params.id
      const student = await User.findByPk(id)
      if (!student) throw new Error("User doesn't exist.")

      res.render('students/edit', { student })
    } catch (err) {
      next(err)
    }
  },
  putStudentEdit: (req, res, next) => {
    const { name, nation, introduction } = req.body
    if (req.params.id !== req.user.id.toString()) {
      return res.redirect(`students/${req.user.id}`)
    }
    if (name && name.length > 20) throw new Error("Name can't over 20 letter")
    if (introduction && introduction.length > 140) throw new Error("Introduction can't over 140 letter")
    const { file } = req
    Promise.all([User.findByPk(req.params.id), imgurFileHandler(file)])
      .then(([user, filepath]) => {
        return user.update({
          name,
          nation,
          introduction,
          avatar: filepath || user.avatar
        })
      })
      .then(() => {
        req.flash('success_messages', 'Profile was successfully to update')
        res.redirect('edit')
      })
      .catch(err => next(err))
  },
  getApplyTutor: (req, res, next) => {
    res.render('students/apply')
  },
  postApplyTutor: (req, res, next) => {
    if (!req.body.name || !req.body.link) {
      throw new Error('除了課程介紹外，其餘欄位皆為必填！')
    }
    Promise.all([
      Course.findOne({ where: { tutorId: req.user.id } }),
      User.findByPk(req.user.id)
    ])
      .then(([course, user]) => {
        if (course) {
          throw new Error('你已是老師了!')
        }
        return Course.create({
          tutorId: req.user.id,
          name: req.body.name,
          introduction: req.body.introduction,
          link: req.body.link
        }).then(() => {
          return user.update({ role: 'tutor' })
        })
      })
      .then(() => {
        req.flash('success_messages', '已成功成為老師!')
        res.redirect('/')
      })
      .catch(err => next(err))
  },
  getComment: async (req, res, next) => {
    try {
      const id = req.params.id
      const booking = await Booking.findByPk(id, {
        include: [Course],
        raw: true,
        nest: true
      })
      if (!booking) throw new Error('課程不存在')
      res.render('students/comment', {
        booking
      })
    } catch (err) {
      next(err)
    }
  },
  postComment: async (req, res, next) => {
    try {
      const id = req.params.id
      const { content } = req.body

      const booking = await Booking.findByPk(id)
      if (!booking) {
        throw new Error('預定紀錄不存在')
      }

      const comment = await Comment.create({
        content,
        score: req.body.score,
        StudentId: req.user.id,
        BookingId: id
      })

      return res.status(200).json({
        status: 'success',
        message: '成功發表回覆！',
        comment
      })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = studentController
