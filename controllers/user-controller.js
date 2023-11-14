const bcrypt = require('bcryptjs') // 載入 bcrypt
const { getUser } = require('../helpers/auth-helpers')
const db = require('../models')
const { User } = db
const userController = {
  signUpPage: (req, res) => {
    res.render('signup')
  },
  signUp: (req, res, next) => {
    if (req.body.password !== req.body.passwordCheck) {
      throw new Error('Passwords do not match!')
    }

    User.findOne({ where: { email: req.body.email } })
      .then(user => {
        if (user) throw new Error('Email already exists!')

        return bcrypt.hash(req.body.password, 10)
      })
      .then(hash =>
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: hash
        })
      )
      .then(() => {
        req.flash('success_messages', '成功註冊帳號！')
        res.redirect('/signin')
      })
      .catch(err => next(err))
  },
  signInPage: (req, res) => {
    res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')

    // 獲取用戶的角色
    const userRole = getUser(req).role

    // 根據用戶的角色重定向到不同的頁面
    if (userRole === 'student' || userRole === 'tutor') {
      res.redirect('/students/courses')
    } else if (userRole === 'admin') {
      res.redirect('/admin/users')
    } else {
      res.redirect('/signin')
    }
  },
  signOut: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  }
}

module.exports = userController
