const bcrypt = require('bcryptjs')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.passwordCheck) {
        throw new Error('password跟checkedpassword需一致')
      }

      const user = await User.findOne({ where: { email: req.body.email } })
      if (user) {
        throw new Error('Email already exists!')
      }

      const hash = await bcrypt.hash(req.body.password, 10)

      await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hash,
        role: 'student'
      })

      req.flash('success_messages', '成功註冊帳號！')
      res.redirect('/signin')
    } catch (err) {
      next(err)
    }
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    const { role, id } = req.user
    if (role === 'tutor') res.redirect(`/tutors/${id}`)
    if (role === 'student') res.redirect('/students/courses')
    if (role === 'admin') res.redirect('/admin/users')
  },
  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
