const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

//여행 통계 : 지출구분
router.get('/:travelId', async (req, res) => {
    let travels = await travel.find({ _id : req.params.travelId });

    if(!travels){
        res.status(404).send({
            "responseMessage" : "Travel Not Found"
        });
    } else {
        let histories = travels.history;
        let card = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }
        let income = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }
        let cash = {
            "cnt" : 0,
            "total" : 0,
            "percentage" : 0,
            "history" : []
        }

        for (var attr in histories) {
            if (attr.isIncome == 0) {   //지출일 때
                if (attr.category == 0) {//현금일 때
                    cash.cnt += 1;
                    cash.total += attr.sum;
                    cash.history.push(attr)
                } else {
                    card.cnt += 1;
                    card.total += attr.sum;
                    card.history.push(attr)

                }
            } else {    //수입일 때
                income.cnt += 1;
                income.total += attr.sum;
                income.history.push(attr)
            }
        }

        let totalSum = card.total + cash.total + income.total;
        card.percentage = (card.total / totalSum) * 100;
        cash.percentage = (cash.total / totalSum) * 100;
        income.percentage = (income.total / totalSum) * 100;

        res.status(200).send({
            "responseMessage" : "Succeddfully Get Data",
            "cash" : cash,
            "card" : card,
            "income" : income
        });
    }
});









module.exports = router;