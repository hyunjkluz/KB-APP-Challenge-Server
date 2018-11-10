const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt.js');
let travel = require('../../module/schema/travelSchema.js');


//마이페이지 메인
router.get('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let userId = decoded.user_idx;

    let lists = await travel.find({ userId : userId }, 
        {
            _id : 1,
            title : 1,
            country : 1,
            accountNumber : 1,
            balance : 1,
            start : 1,
            end : 1
        });

    if (!lists) {
        res.status(404).send({
            "responseMessage" : "Accounts Not Found"
        });
    } else {
        res.status(200).send({
            "responseMessage" : "Successfully Get Data",
            "userData" : lists
        });
    }

});
module.exports = router;