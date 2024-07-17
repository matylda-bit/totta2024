const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')

// Register Handle
router.post('/register', async (req, res) => {
  const { username, email, password, password2 } = req.body
  const errors = []

  if (!username || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' })
  }

  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' })
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' })
  }

  if (errors.length > 0) {
    res.render('register', { errors, username, email, password, password2 })
  } else {
    try {
      let user = await User.findOne({ email })
      if (user) {
        errors.push({ msg: 'Email already exists' })
        res.render('register', { errors, username, email, password, password2 })
      } else {
        user = new User({ username, email, password })
        await user.save()
        req.flash('success_msg', 'You are now registered and can log in')
        res.redirect('/login')
      }
    } catch (err) {
      console.error(err)
      res.render('register', { errors, username, email, password, password2 })
    }
  }
})

// Login Handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  })(req, res, next)
})

// Logout Handle
router.get('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err)
    req.flash('success_msg', 'You are logged out')
    res.redirect('/login')
  })
})

module.exports = router
