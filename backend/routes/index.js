const express = require('express');
const router = express.Router();
router.use('/user', require('./user'));
router.use('/character', require('./character'));
router.use('/character', require('./character'));
router.use('/contribution', require('./contribution'));
module.exports = router;
