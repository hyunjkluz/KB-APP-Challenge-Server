const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

function checkEmpty(attr) {
    if (attr.budget == 0) {
        return null;
    } else {
        return attr;
    }
}

//여행 통계 : 예산대비
router.get('/:travelId', async (req, res) => {
    let oneTravel = await travel.find({ _id : req.params.travelId });

    if(!oneTravel){
        res.status(404).send({
            "responseMessage" : "Travel Not Found"
        });
    } else {
        let budgets = oneTravel[0].budgets;     //여행 예산
        let history = oneTravel[0].history;

        let food = {
            "budget" : 0,
            "expenseTotal" : 0,
            "term" : 0,
            "percentage" : 0
        }
        let shop = {
            "budget" : 0,
            "expenseTotal" : 0,
            "term" : 0,
            "percentage" : 0
        }
        let culture = {
            "budget" : 0,
            "expenseTotal" : 0,
            "term" : 0,
            "percentage" : 0
        }
        let accommodation = {
            "budget" : 0,
            "expenseTotal" : 0,
            "term" : 0,
            "percentage" : 0
        }
        let flight = {
            "budget" : 0,
            "expenseTotal" : 0,
            "term" : 0,
            "percentage" : 0
        }

        for (let i = 0; i < history.length; i++) {
            let attr = history[i];
            if (attr.isIncome == 0) {   //지출일 때
                if (attr.category == 0) {           //식/음료 일 때
                    food.expenseTotal += attr.sum;
                } else if (attr.category == 1) {    //쇼핑
                    shop.expenseTotal += attr.sum;
                } else if (attr.category == 2) {    //문화
                    culture.expenseTotal += attr.sum;
                } else if (attr.category == 3) {    //숙소
                    accommodation.expenseTotal += attr.sum;
                } else {                            //항공
                    flight.expenseTotal += attr.sum;
                }
            } else continue;
        }

        for (let i = 0; i < budgets.length; i++) {
            let attr = budgets[i];
            if (attr.category == 0) {           //식/음료 일 때
                food.budget = attr.sum;
                food.term = attr.term;
            } else if (attr.category == 1) {    //쇼핑
                shop.budget = attr.sum;
                shop.term = attr.term;
            } else if (attr.category == 2) {    //문화
                culture.budget = attr.sum;
                culture.term = attr.term;
            } else if (attr.category == 3) {    //숙소
                accommodation.budget = attr.sum;
                accommodation.term = attr.term;
            } else {                            //항공
                flight.budget = attr.sum;
                flight.term = attr.term;
            }
        }

        food.percentage = Math.floor((food.expenseTotal / food.budget) * 100);
        shop.percentage = Math.floor((shop.expenseTotal / shop.budget) * 100);
        culture.percentage = Math.floor((culture.expenseTotal / culture.budget) * 100);
        accommodation.percentage = Math.floor((accommodation.expenseTotal / accommodation.budget) * 100);
        flight.percentage = Math.floor((flight.expenseTotal / flight.budget) * 100);

        food = checkEmpty(food);
        shop = checkEmpty(shop);
        culture = checkEmpty(culture);
        accommodation = checkEmpty(accommodation);
        flight = checkEmpty(flight);

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

//예산 등록 및 수정
router.post('/', async (req, res) => {
    // budgets = [{
    //     "categoty" : 0,
    //     "sum" : 0,
    //     "term" : 0
    // }]
    await travel.update(
        { _id : req.body.travelId }, { $set : req.body }, (err, output) => {
            if (err) {
                res.status(500).send({
                    "responseMessage" : "Internal Server Error : Update"
                });
            }
            if (!output.n) {
                return res.status(404).send({
                    "responseMessage" : "Travel Not Found"
                });
            }
            res.status(200).send({
                "responseMessage" : "Successfully Update Travel Budget"
            })
        }
    );
});

module.exports = router;
