const { Course } = require('../models')

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
  }
}

module.exports = studentController
