const express = require('express');
const router = express.Router();
const calc = require('../../module/calc');
let travel = require('../../module/schema/travelSchema.js');

//여행 통계 : 지출 카테고리
router.get('/:travelId', async (req, res) => {
    let travels = await travel.find({ _id : req.params.travelId });

    if(!travels){
        res.status(404).send({
            "responseMessage" : "Travel Not Found"
        });
    } else {
        let histories = travels[0].history;
        let categories = calc.category(histories)

        res.status(200).send({
            "responseMessage" : "Succeddfully Get Data",
            "food" : categories[0],
            "shop" : categories[1],
            "culture" : categories[2],
            "accommodation" : categories[3],
            "flight" : categories[4]
        });
    }
});









module.exports = router;