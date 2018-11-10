var express = require('express');
var router = express.Router();

//메인화면
router.use('/', require('./home.js'));

//로그인과 회원가입
router.use('/user', require('./user/user.js'));

//마이페이지
router.use('/mypage', require('./mypage/mypage.js'));

//여행 등록
router.use('/travel', require('./travel/travel.js'));

//가계부 : 치출 및 소비내역 등록, 가계부 보기
router.use('/ledger', require('./ledger/ledger.js'));

//여행 통계 : 지출구분, 지출 카테고리, 예산 대비, 예산 기입 
router.use('/statistic', require('./statistic/index.js'));

//여행 히스토리
router.use('/history', require('./history/history.js'));

//저축
router.use('/save', require('./save/save.js'));

module.exports = router;
