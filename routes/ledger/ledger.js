const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

//지출 + 소비 내역 보기 : 가계부
router.get('/:travelId', async(req, res) => {
    travel.find({ _id : req.params.travelId }, function(err, travels){
        if(travels.length === 0 || err){
            res.status(404).send({
                "responseMessage" : "Travel Not Found"
            });
        } else {
            res.status(200).send({
                "responseMessage" : "Successfully Get Travel",
                "expense" : travels.expense,
                "income" : travels.income
            });
        }
    });
});

//가계부 날짜별
router.get('/:travelId/:date', async(req, res) => {
    travel.find({ $and: [ { _id : req.params.travelId }, { "expense.date" : req.params.date }, { "import.date" : req.params.date }] }, function(err, travels){
        if(travels.length === 0 || err){
            res.status(404).send({
                "responseMessage" : "Travel Not Found"
            });
        } else {
            res.status(200).send({
                "responseMessage" : "Successfully Get Travel",
                "expense" : travels.expense,
                "income" : travels.income
            });            
        }
    });
});

//지출 + 소비 내역 추가
router.post('/', async (req, res) => {
    if (req.body.isIncome) {        //수입일 때
        let income = {
            isIncome : 1,
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
            isIncome : 0,
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