const express = require('express')
const router = express.Router()

//@desc Login/landing page
//@route GET /
router.get('/', (req, res) => {
    res.send('Login')
}) 


//@desc Dasbord
//@route GET /dashboard
router.get('/dashboard', (req, res) => {
    res.send('Dasbord')
}) 





module.exports = router
