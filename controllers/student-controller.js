const { User, Course } = require('../models')

const studentController = {
  getCourses: (req, res, next) => {
    Course.findAll({
      raw: true
    })
      .then(courses => res.render('students/courses', { courses }))
      .catch(err => next(err))
  },
  getCourse: (req, res, next) => {
    Course.findByPk(req.params.id, {
      raw: true
    })
      .then(course => {
        if (!course) throw new Error("Course didn't exist!")

        res.render('students/course', { course })
      })
      .catch(err => next(err))
  },
  getStudent: async (req, res, next) => {
    try {
      const id = req.params.id
      const student = await User.findByPk(id, { raw: true })

      if (!student) {
        throw new Error("User doesn't exist.")
      }

      res.render('students/profile', { student })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = studentController
