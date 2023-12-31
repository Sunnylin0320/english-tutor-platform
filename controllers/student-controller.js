const { Op } = require('sequelize')
const Sequelize = require('sequelize')
const dayjs = require('dayjs')
const { User, Course, Booking, Comment } = require('../models')
const { getOffset, getPagination } = require('../helpers/pagination-helper')
const { imgurFileHandler } = require('../helpers/file-helpers')
const { getAvailablePeriod } = require('../helpers/time-helpers')

const studentController = {
  getCourses: (req, res, next) => {
    const keyword = req.query.keyword || ''
    const DEFAULT_LIMIT = 6
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || DEFAULT_LIMIT
    const offset = getOffset(limit, page)
    Course.findAndCountAll({
      include: [{ model: User }],
      limit,
      offset,
      raw: true,
      nest: true
    })
      .then(coursesAll => {
        const courses = coursesAll.rows.filter(
          course =>
            course.name.toLowerCase().includes(keyword.toLowerCase()) ||
            course.User.name.toLowerCase().includes(keyword.toLowerCase())
        )

        User.findAll({
          attributes: ['id', 'name'],
          where: {
            role: 'student'
          },
          raw: true
        })
          .then(users => {
            res.render('students/courses', {
              courses,
              keyword,
              pagination: getPagination(limit, page, courses.count),
              users
            })
          })
          .catch(err => next(err))
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

      const formattedcourse = await Course.findByPk(id, {
        attributes: ['startTime', 'endTime', 'spendTime', 'bookingDay'],
        raw: true,
        nest: true
      })
      formattedcourse.spendTime = parseInt(formattedcourse.spendTime)

      const bookingData = await Booking.findAll({
        raw: true,
        nest: true,
        attributes: ['classTime'],
        where: {
          CourseId: course.id
        }
      })
      const formattedBookingData = bookingData.map(item => ({
        classTime: dayjs(item.classTime)
          .format('YYYY-MM-DD HH:mm:ss')
      }))

      console.log(formattedcourse)
      console.log(formattedBookingData)

      const availableTime = getAvailablePeriod(formattedcourse, formattedBookingData)

      res.render('students/course', {
        course,
        availableTime
      })
    } catch (err) {
      next(err)
    }
  },
  postCourse: async (req, res, next) => {
    try {
      const studentId = req.user.id
      const courseId = req.params.id
      const { classTime } = req.body

      const course = await Course.findByPk(courseId)
      if (!course) {
        throw new Error('該課程不存在！')
      }

      await Booking.create({
        StudentId: studentId,
        CourseId: courseId,
        period: course.spendTime,
        classTime
      })

      req.flash('success_messages', '已成功預約課程!')
      res.redirect(`/students/courses/${courseId}`)
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
        attributes: ['classTime'],
        where: {
          StudentId: id,
          classTime: { [Sequelize.Op.gt]: new Date() }
        },
        include: [
          {
            model: Course,
            include: [{ model: User }]
          }
        ],
        nest: true,
        raw: true,
        order: [['classTime', 'ASC']]
      })
      const lessonHistory = await Booking.findAll({
        where: {
          StudentId: id,
          classTime: { [Op.lt]: new Date() }
        },
        include: [
          {
            model: Course,
            attributes: ['name', 'link'],
            include: [
              {
                model: User
              }
            ]
          },
          {
            model: Comment,
            required: false,
            where: { BookingId: Sequelize.col('BookingId') }
          }
        ],
        nest: true,
        raw: true
      })
      console.log(lessonHistory)

      lessonHistory.forEach(booking => {
        booking.hasCommented = booking.Comment.content !== null
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
    if (introduction && introduction.length > 140) {
      throw new Error("Introduction can't over 140 letter")
    }
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
      const UserId = req.user.id
      const BookingId = req.body.bookingId
      const existingComment = await Comment.findOne({
        where: {
          BookingId,
          StudentId: req.user.id
        }
      })
      if (existingComment) {
        req.flash('error_messages', '您已經發表過評論!')
        res.redirect(`/students/${UserId}`)
      } else {
        const booking = await Booking.findByPk(BookingId, {
          include: [
            {
              model: Course,
              include: [{ model: User }]
            }
          ]
        })

        if (!booking) {
          req.flash('error_messages', '預定不存在!')
          res.redirect(`/students/${UserId}`)
          return
        }
        const TutorId = booking.Course.User.id
        await Comment.create({
          content: req.body.content,
          score: req.body.score,
          StudentId: req.user.id,
          BookingId,
          TutorId
        })
      }

      req.flash('success_messages', '已成功發表評論!')
      res.redirect(`/students/${UserId}`)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = studentController
