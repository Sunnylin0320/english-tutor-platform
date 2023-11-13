if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')

const dayjsHelpers = require('./helpers/dayjs-helpers')
const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'

app.engine('hbs', exphbs({ extname: '.hbs', helpers: dayjsHelpers }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))
app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)
// 設定 port 3000
app.listen(3000, () => {
  console.log(`App is running on http://localhost:${port}/`)
})

module.exports = app
