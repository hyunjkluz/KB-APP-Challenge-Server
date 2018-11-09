const express = require('express');
const router = express.Router();
const jwt = require('../module/jwt.js');


router.get('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);
    let user_idx = decoded.user_idx;

    
});



module.exports = router;