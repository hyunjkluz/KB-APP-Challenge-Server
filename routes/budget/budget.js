const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

//여행 통계 : 예산대비
router.get('/:travleId', async (req, res) => {
    travel.find({ _id : req.params.travelId }, function(err, travels){
        if(travels.length === 0 || err){
            res.status(404).send({
                "responseMessage" : "Travel Not Found"
            });
        } else {
            let expense = travels.expense;
            let expenseDict = [];

            //지출 목록 카테고리별로 분류
            for (let i = 0; i < expense.length; i++) {
                if (!(expense[i].category in expenseDict)) {
                    expenseDict.push({
                        key:   expense[i].category,
                        value: expense[i].sum
                    });
                } else {
                    expenseDict[expense[i].category].value += expense[i].sum
                }
            }

            let budget = travels.budgets;
            
            //예산당 지출 퍼센트 구하기
            for (let i = 0; i < budget.length; i++) {
                let usage = expenseDict[budget.category].value;
                let percentage = (usage / budget[i].sum) * 100;
                budget[i].usage = usage
                budget[i].percentage = percentage;
            }

            res.status(201).send({
                "responseMessage" : "Successfully Get Budget Data",
                "budgets" : budget
            });
        }
      });
});


//예산 등록 및 수정
router.post('/', async (req, res) => {
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