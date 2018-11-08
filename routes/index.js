var express = require('express');
var router = express.Router();

router.use('/', require('./home.js'));

router.use('/user', require('./user/user.js'));

router.use('/mypage', require('./mypage/mypage.js'));

router.use('/travel', require('./travel/travel.js'));

router.use('/budget', require('./budget/budget.js'));

router.use('/save', require('./save/save.js'));

module.exports = router;
