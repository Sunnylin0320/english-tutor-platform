const { ensureAuthenticated, getUser } = require('../helpers/auth-helpers')

const authenticated = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    return next()
  }
  res.redirect('/signin')
}

const authenticatedStudent = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'student') return next()
    res.redirect('/signin')
  };
}

const authenticatedTutor = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'tutor') return next()
    res.redirect('/signin')
  };
}

const authenticatedAdmin = (req, res, next) => {
  if (ensureAuthenticated(req)) {
    if (getUser(req).role === 'admin') {
      return next()
    }
  }
  res.redirect('/signin')
}

module.exports = {
  authenticated,
  authenticatedStudent,
  authenticatedTutor,
  authenticatedAdmin
}
