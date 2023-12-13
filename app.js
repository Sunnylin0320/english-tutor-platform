if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const path = require('path')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const exphbs = require('express-handlebars')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const passport = require('./config/passport')
const handlebarsHelpers = require('handlebars-helpers')()

const dayjsHelpers = require('./helpers/dayjs-helpers')
const { getUser } = require('./helpers/auth-helpers')
const routes = require('./routes')
const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const port = process.env.PORT || 3000

const hbs = exphbs({
  extname: '.hbs',
  helpers: {
    ...handlebarsHelpers,
    ...dayjsHelpers
  }
})
app.engine('hbs', hbs)
app.set('view engine', 'hbs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

io.on('connection', socket => {
  console.log('A user connected')

  socket.on('chat message', message => {
    io.emit('chat message', message)
  })

  socket.on('disconnect', () => {
    console.log('A user disconnected')
  })
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})

module.exports = app
