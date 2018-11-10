const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

//여행 통계 : 지출 카테고리
router.get('/:travelId', async (req, res) => {
    let travels = await travel.find({ _id : req.params.travelId });

    if(!travels){
        res.status(404).send({
            "responseMessage" : "Travel Not Found"
        });
    } else {
        let histories = travels.history;
        let food = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }
        let shop = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }
        let culture = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }
        let accommodation = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }
        let flight = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }

        for (var attr in histories) {
            if (attr.isIncome == 0) {   //지출일 때
                if (attr.category == 0) {           //식/음료 일 때
                    food.cnt += 1;
                    food.total += attr.sum;
                    food.history.push(attr)
                } else if (attr.category == 1) {    //쇼핑
                    shop.cnt += 1;
                    shop.total += attr.sum;
                    shop.history.push(attr)
                } else if (attr.category == 2) {    //문화
                    culture.cnt += 1;
                    culture.total += attr.sum;
                    culture.history.push(attr)
                } else if (attr.category == 3) {    //숙소
                    accommodation.cnt += 1;
                    accommodation.total += attr.sum;
                    accommodation.history.push(attr)
                } else {                            //항공
                    flight.cnt += 1;
                    flight.total += attr.sum;
                    flight.history.push(attr)
                }
            } else continue;
        }

        let totalSum = food.total + shop.total + culture.total + accommodation.total + flight.total;
        food.percentage = (food.total / totalSum) * 100;
        shop.percentage = (shop.total / totalSum) * 100;
        culture.percentage = (culture.total / totalSum) * 100;
        accommodation.percentage = (accommodation.total / totalSum) * 100;
        flight.percentage = (flight.total / totalSum) * 100;

        res.status(200).send({
            "responseMessage" : "Succeddfully Get Data",
            "food" : food,
            "shop" : shop,
            "culture" : culture,
            "accommodation" : accommodation,
            "flight" : flight
        });
    }
});









module.exports = router;