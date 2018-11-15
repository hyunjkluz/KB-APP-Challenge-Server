const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');
let ment = require('../../module/schema/mentSchema');

//공유하기
router.get('/:travelId', async(req, res) => {
    let linkUrl = "https://traveluck.apps.dev.clayon.io/history/" + req.params.travelId;
    res.status(200).send({
        "responseMessage" : "Successfully Get Share Link",
        "linkUrl" : linkUrl
    });
});

//멘트 삽입
router.post('/', async(req, res) =>{
    await ment.create({
        country : req.body.country,
        ment : req.body.ment
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