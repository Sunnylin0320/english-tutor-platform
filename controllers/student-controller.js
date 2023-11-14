const { Course } = require('../models')

const studentController = {
  getCourses: (req, res, next) => {
    Course.findAll({
      raw: true
    })
      .then(courses => res.render('courses', { courses }))
      .catch(err => next(err))
  }
}

module.exports = studentController
