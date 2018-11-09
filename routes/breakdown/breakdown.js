const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

//지출 + 소비 내역 보기 : 가계부
router.get('/:travelId', async(req, res) => {
    


});

//지출 + 소비 내역 추가
router.post('/', async (req, res) => {
    if (req.body.isIncome) {
        let income = {
            title : req.body.title,
            unit : req.body.unit,
            category : req.body.category,
            payment : req.body.payment,
            date : req.body.date
        }
        await travel.update(
            { _id : req.body.travelId },
            { $push : { income : income}}, async (err, incomes) => {
                if (err) {
                    res.status(500).send({
                        "responseMessage" : "Internal Server Error : Update"
                    });
                } else {
                    res.status(200).send({
                        "responseMessage" : "Successfully Insert Income"
                    });
                }
            }
        );
    } else {
        let expense = {
            title : req.body.title,
            sum : req.body.sum,
            unit : req.body.unit,
            category : req.body.category,
            payment : req.body.payment,
            date : req.body.date,
            latitude : req.body.latitude,
            longitude : req.body.longitude
        }
        await travel.update(
            { _id : req.body.travelId },
            { $push : { expense : expense}}, async (err, expenses) => {
                if (err) {
                    res.status(500).send({
                        "responseMessage" : "Internal Server Error : Update"
                    });
                } else {
                    res.status(200).send({
                        "responseMessage" : "Successfully Insert Expense"
                    });
                }
            }
        );
    }
});

//지출 + 소비 내역 수정
router.put('/', async (req, res) => {
});

//지출 내역 삭제
router.delete('/', async (req, res) => {
});










module.exports = router;