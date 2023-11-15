const { User, Course } = require('../models')

const studentController = {
  getCourses: (req, res, next) => {
    return Course.findAll({
      include: User,
      nest: true,
      raw: true
    }).then(courses => {
      const data = courses.map(r => ({
        ...r
      }))
      return res.render('students/courses', {
        courses: data
      })
    })
  },
  getCourse: (req, res, next) => {
    return Course.findByPk(req.params.id, {
      include: User,
      nest: true,
      raw: true
    })
      .then(course => {
        if (!course) throw new Error("Course didn't exist!")

        res.render('students/course', {
          course
        })
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
