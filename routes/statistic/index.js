var express = require('express');
var router = express.Router();

//지출 구분
router.use('/division', require('./division.js'));

//지출 카테고리
router.use('/category', require('./category.js'));

//예산 대비
router.use('/compare', require('./compare.js'));

module.exports = router;
