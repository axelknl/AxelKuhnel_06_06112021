const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');
const check = require('../middleware/dataValidation');

router.post('/', auth,multer, check.checkSauce ,sauceCtrl.newSauce);
router.get('/',auth, sauceCtrl.getSauces);
router.get('/:id',auth, sauceCtrl.getOneSauce);
router.delete('/:id',auth, sauceCtrl.deleteSauce);
router.post('/:id/like',auth, sauceCtrl.likeSauce);
router.put('/:id',auth, multer,check.checkSauce ,sauceCtrl.changeSauce);

module.exports = router;