const Sequelize = require('sequelize')
const { User, Course, Booking } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const tutorController = {
  getTutor: async (req, res, next) => {
    try {
      const id = req.params.id
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
          createdAt: { [Sequelize.Op.gt]: new Date('2023-11-01') }
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
      console.log('New bookings:', newBookings)
      res.render('tutors/profile', { tutor, newBookings })
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
  putTutorEdit: (req, res, next) => {
    const { name, nation, introduction } = req.body
    if (req.params.id !== req.user.id.toString()) {
      return res.redirect(`tutors/${req.user.id}`)
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
  }
}

module.exports = tutorController
