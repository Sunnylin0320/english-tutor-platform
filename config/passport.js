const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook').Strategy
const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User

passport.use(
  new LocalStrategy(

    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },

    (req, email, password, cb) => {
      User.findOne({ where: { email } }).then(user => {
        if (!user) {
          return cb(
            null,
            false,
            req.flash('error_messages', '帳號不存在！')
          )
        }

        bcrypt.compare(password, user.password).then(res => {
          if (!res) {
            return cb(null, false, req.flash('error_messages', '帳號不存在！'))
          }

          return cb(null, user)
        })
      })
    }
  )
)

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK,
      profileFields: ['email', 'displayName']
    },
    (accessToken, refreshToken, profile, done) => {
      const { name, email } = profile._json
      User.findOne({ email }).then(user => {
        if (user) return done(null, user)

        const randomPassword = Math.random().toString(36).slice(-8)
        bcrypt
          .genSalt(10)
          .then(salt => bcrypt.hash(randomPassword, salt))
          .then(hash =>
            User.create({
              name,
              email,
              password: hash
            })
          )
          .then(user => done(null, user))
          .catch(err => done(err, false))
      })
    }
  )
)

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id).then(user => {
    user = user.toJSON()
    return cb(null, user)
  })
})

module.exports = passport
