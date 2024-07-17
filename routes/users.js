const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')

router.get('/profile', ensureAuthenticated, (req, res) => {
  res.render('profile', { user: req.user })
})

module.exports = router
