const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const check = require('../middleware/dataValidation');

router.post('/signup', check.checkUser, userCtrl.signup);
router.post('/login', check.checkUser, userCtrl.login);

module.exports = router;