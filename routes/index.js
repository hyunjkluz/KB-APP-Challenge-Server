var express = require('express');
var router = express.Router();

router.use('/', require('./home.js'));

router.use('/user', require('./user/user.js'));

router.use('/mypage', require('./mypage/mypage.js'));

router.use('/travel', require('./travel/travel.js'));

//예산 기입
router.use('/budget', require('./budget/budget.js'));

//지출, 소비 내역 관리
router.use('/breakdown', require('./breakdown/breakdown.js'));

router.use('/save', require('./save/save.js'));

module.exports = router;
