const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

//지출 + 소비 내역 보기 : 가계부
router.get('/:travelId', async(req, res) => {
    let history = await travel.find({ _id : req.params.travelId });

    if (!history) {
        res.status(500).send({
            "responseMessage" : "Internal Server Error"
        });
    } else if (history.length == 0) {
        res.status(404).send({
            "responseMessage" : "Travel Not Found"
        });
    }else {
        let printHistory = new Array();

        for (let i = history[0].history.length; i >= 0 ; i--) {
            printHistory.push(history[0].history[i]);
        }

        res.status(200).send({
            "responseMessage" : "Successfully Get Travel",
            "history" : printHistory
        });
    }
});

//가계부 날짜별
router.get('/:travelId/:date', async(req, res) => {
    let flag = new Date(req.params.date);
    //console.log(flag);
    let flagDate = flag.getFullYear() + flag.getMonth() + flag.getDate();   //검색할 날짜
    //console.log(flagDate);
    let dateHis = await travel.find({ $and: [ { _id : req.params.travelId }] }, {history : 1});
    
    if (!dateHis) {
        res.status(500).send({
            "responseMessage" : "Internal Server Error"
        });
    } else if (dateHis.length == 0) {
        res.status(404).send({
            "responseMessage" : "Travel Not Found"
        });
    }else {
        dateHis = dateHis[0].history;

        let data = [];  //기준 날짜에 해당하는 데이터만 받을 배열
        for (let i = 0; i < dateHis.length; i++) {
            let d = dateHis[i].date;

            if (!(dateHis[i].date instanceof Date)) {
                d = new Date(dateHis[i].date)
            }
            
            //console.log(d);
            let dDate = d.getFullYear() + d.getMonth() + d.getDate();
            //console.log(dDate);
            if (dDate == flagDate) {    //기준 날짜와 같을 경우
                data.unshift(dateHis[i]);
            }
        }
        res.status(200).send({
            "responseMessage" : "Successfully Get Travel",
            "history" : data
        });
    }
});

//지출 + 소비 내역 추가
router.post('/', function (req, res, next) {
    if (!req.body.travelId) {
        res.status(403).send({
            "responseMessage" : "Null Value(Travel ID)"
        });
    } else {
        let history = {
            isIncome : req.body.isIncome,
            title : req.body.title,
            sum : req.body.sum,
            unit : req.body.unit,
            category : req.body.category,
            payment : req.body.payment,
            date : new Date(req.body.date),
            latitude : req.body.latitude,
            longitude : req.body.longitude
        }

        travel.update(
            { _id : req.body.travelId},{ $push : { "history" : history}}, function (err, histories) {
                if (err) {
                    res.status(500).send({
                        "responseMessage" : "Internal Server Error : Update"
                    });
                } else {
                    res.status(200).send({
                        "responseMessage" : "Successfully Insert History"
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