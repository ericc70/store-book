const express = require('express')
const router = express.Router()

const passport = require('passport')

//@desc Login/landing page
//@route GET /
router.get('/', (req, res) => {
    res.render('login',
    {
        layout: 'login',
    })
}) 


//@desc Dasbord
//@route GET /dashboard
router.get('/dashboard', (req, res) => {
    res.render('dashboard')
}) 



router.get('/oauth2/redirect/google',
  passport.authenticate('google', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router
