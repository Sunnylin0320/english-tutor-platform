const Sequelize = require('sequelize')
const { User, Course, Booking, Comment } = require('../models')

const tutorController = {
  getTutor: async (req, res, next) => {
    try {
      const id = req.user.id
      const tutor = await User.findByPk(id, { raw: true })

      if (!tutor) {
        throw new Error("User doesn't exist.")
      }
      const tutorCourses = await Course.findAll({
        where: {
          TutorId: tutor.id
        },
        raw: true
      })
      const newBookings = await Booking.findAll({
        where: {
          CourseId: tutorCourses.map(course => course.id),
          period: { [Sequelize.Op.gt]: new Date() }
        },
        include: [
          {
            model: Course,
            attributes: ['name', 'link'],
            include: [{ model: User }]
          },
          {
            model: User,
            attributes: ['name']
          }
        ],
        nest: true,
        raw: true,
        order: [['classTime', 'ASC']]
      })
      const recentReceived = await Comment.findAll({
        where: {
          TutorId: tutor.id
        },
        nest: true,
        raw: true
      })

      res.render('tutors/profile', { tutor, newBookings, recentReceived })
    } catch (err) {
      next(err)
    }
  },
  getTutorEdit: async (req, res, next) => {
    try {
      const id = req.params.id
      const tutor = await User.findByPk(id)
      if (!tutor) throw new Error("User doesn't exist.")

      res.render('tutors/edit', { tutor })
    } catch (err) {
      next(err)
    }
  },
  putTutorEdit: async (req, res, next) => {
    try {
      const { name, introduction, teachingStyle, spendTime, bookingDay, startTime, endTime } = req.body
      if (req.params.id !== req.user.id.toString()) {
        return res.redirect(`/tutors/${req.user.id}`)
      }

      await Promise.all([User.findByPk(req.params.id)])
        .then(([user]) => {
          return user.update({
            name,
            introduction,
            teachingStyle,
            spendTime,
            bookingDay,
            startTime,
            endTime
          })
        })
        .then(() => {
          req.flash('success_messages', 'Profile was successfully updated')
          res.redirect('/edit')
        })
        .catch(err => next(err))
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tutorController
