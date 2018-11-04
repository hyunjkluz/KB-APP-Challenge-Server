var express = require('express');
var router = express.Router();

router.use('/', require('./home.js'));

router.use('/mypage', require('./mypage/mypage.js'));

router.use('/account', require('./account/account.js'));

router.use('/travel', require('./travel/travel.js'));

router.use('/breakdown', require('./breakdown/breakdown.js'));

module.exports = router;
