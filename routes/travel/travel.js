const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt.js');
let travel = require('../../module/schema/travelSchema.js');

//여행 계획 입력
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    console.log(decoded);
    let userId = decoded.user_idx;

    console.log(userId);

    await travel.create({
        userId : userId,
        title : req.body.title,
        country : req.body.country,
        start : req.body.start,
        end : req.body.end,
        targetDay : req.body.targetDay,
        targetSum : req.body.targetSum,
        accountNumber : req.body.accountNumber,
        balance : req.body.balance
    }, async (err, travels) => {
        if (err) {
            res.status(405).send({
                "responeMessage" : "Internal Server Error : Insert"
            });
        } else {
            res.status(200).send({
                "responeMessage" : "Successfully Insert Travel"
            });            
        }
    });
});



module.exports = router;