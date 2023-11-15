const { User } = require('../models')
const { imgurFileHandler } = require('../helpers/file-helpers')

const tutorController = {
  getTutor: async (req, res, next) => {
    try {
      const id = req.params.id
      const tutor = await User.findByPk(id, { raw: true })

      if (!tutor) {
        throw new Error("User doesn't exist.")
      }

      res.render('tutors/profile', { tutor })
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
