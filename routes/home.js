const express = require('express');
const router = express.Router();
const jwt = require('../module/jwt.js');
let travel = require('../../module/schema/travelSchema.js');

//두 날짜 차이 계산
function dateDiff(_date1, _date2) {
    var diffDate_1 = _date1 instanceof Date ? _date1 : new Date(_date1);
    var diffDate_2 = _date2 instanceof Date ? _date2 : new Date(_date2);

    diffDate_1 = new Date(diffDate_1.getFullYear(), diffDate_1.getMonth()+1, diffDate_1.getDate());
    diffDate_2 = new Date(diffDate_2.getFullYear(), diffDate_2.getMonth()+1, diffDate_2.getDate());

    var diff = Math.abs(diffDate_2.getTime() - diffDate_1.getTime());
    diff = Math.ceil(diff / (1000 * 3600 * 24));

    return diff;
}

router.get('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);
    let userId = decoded.user_idx;

    let travels = await travel.find({ userId : userId });

    if (!travels) {
        res.status(500).send({      //에러
            "responseMessage" : "Internal Server Error"
        });
    } else if (travels.length == 0) {
        res.status(201).send({      //등록된 여행이 하나도 없을 때
            "responseMessage" : "Pleas e Add Travel"
        });
    } else {                        //등록된 여행이 있을 때
        let newTravels = [];
        var now = new Date();
        var todayAtMidn = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        for (var tvl in travels) {   //하나의 여행 계획에 대하여
            let newTravelJson = new Object();
            let usageBudgetPercentage = 0;

            if ((tvl.start).getTime() < todayAtMidn.getTime()) { //여행이 시작되었을 때
                //총 지충 내역 계산
                let totalUsage = 0;
                for (let i = 0; i < (tvl.history).length; i++) {
                    totalUsage += tvl.history[i].sum;
                }
                usageBudgetPercentage = (totalUsage / tvl.balence) * 100;

                let histories = tvl.history;
                let food = {
                    "category" : 0,
                    "total" : 0,
                    "percentage" : 0
                }
                let shop = {
                    "category" : 1,
                    "total" : 0,
                    "percentage" : 0
                }
                let culture = {
                    "category" : 2,
                    "total" : 0,
                    "percentage" : 0
                }
                let acc = {
                    "category" : 3,
                    "total" : 0,
                    "percentage" : 0
                }
                let flight = {
                    "category" : 4,
                    "total" : 0,
                    "percentage" : 0
                }

                for (var attr in histories) {
                    if (attr.isIncome == 0) {   //지출일 때
                        if (attr.category == 0) {           //식/음료 일 때
                            food.total += attr.sum;
                        } else if (attr.category == 1) {    //쇼핑
                            shop.total += attr.sum;
                        } else if (attr.category == 2) {    //문화
                            culture.total += attr.sum;
                        } else if (attr.category == 3) {    //숙소
                            acc.total += attr.sum;
                        } else {                            //항공
                            flight.total += attr.sum;
                        }
                    } else continue;
                }

                let totalSum = food.total + shop.total + culture.total + acc.total + flight.total;
                food.percentage = (food.total / totalSum) * 100;
                shop.percentage = (shop.total / totalSum) * 100;
                culture.percentage = (culture.total / totalSum) * 100;
                acc.percentage = (acc.total / totalSum) * 100;
                flight.percentage = (flight.total / totalSum) * 100;

                let categories = [food, shop, culture, acc, flight];
                let maxCate = categories[0];

                //최대 지출 카테고리 선택
                for (let i = 1; i < categories.length; i++) {
                    if (maxCate.percentage < categories[i].percentage) {
                        maxCate = categories[i];
                    }
                }
                newTravelJson = {
                    "_id" : tvl._id,
                    "title" : tvl.title,
                    "country" : tvl.country,
                    "diff" : dateDiff(new Date(), tvl.targetDate),
                    "targetSum" : tvl.targetSum,
                    "balance" : tvl.balance,
                    "balancePercentage" : (tvl.balance / tvl.targetSum) * 100,
                    "usageBudgetPercentage" : usageBudgetPercentage,
                    "maxCate" : maxCate
                }
                newTravels.push(newTravelJson);
            } else {                    //여행이 시작 전일 때        
                let newTravelJson = {
                    "_id" : tvl._id,
                    "title" : tvl.title,
                    "country" : tvl.country,
                    "diff" : dateDiff(new Date(), tvl.targetDate),
                    "targetSum" : tvl.targetSum,
                    "balance" : tvl.balance,
                    "balancePercentage" : (tvl.balance / tvl.targetSum) * 100,
                    "usageBudgetPercentage" : null,
                    "maxCate" : null
                }
                newTravels.push(newTravelJson);
            }
        }

        let newHistory = new Array();
        for (var tvl in travels) {   //여행 히스토리 계산
            
            if ((tvl.end).getTime() < todayAtMidn.getTime()) { //여행이 시작되었을 때
                let newHistoryJson = {
                    "_id" : tvl._id,
                    "title" : tvl.title,
                    "country" : tvl.country,
                    "diff" : dateDiff(new Date(), tvl.targetDate),
                    "targetSum" : tvl.targetSum,
                    "start" : tvl.start,
                    "end" : tvl.end
                }
                newHistory.push(newHistoryJson);
            }
        }

        res.status(200).send({
            "responseMessage" : "Successfully Get Data",
            "travels" : newTravels,
            "histories" : newHistory
        });
    }
});



module.exports = router;