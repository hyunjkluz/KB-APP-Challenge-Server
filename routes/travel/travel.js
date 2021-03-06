const express = require('express');
const router = express.Router();
const jwt = require('../../module/jwt.js');
let travel = require('../../module/schema/travelSchema.js');

//여행 계획 입력
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);
    let userId = decoded.userId;

    if (!req.body.start || !req.body.end || !req.body.targetDay || !req.body.accountNumber) {
        res.status(400).send({
            "statusCode" : 400,
            "responseMessage" : "Null Value"
        });
    } else {
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
    }
});

router.get('/:travelId', async (req, res) => {
    
});

module.exports = router;