const { User, Course } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

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
  }
}

module.exports = studentController
