const express = require('express');
const router = express.Router();
const jwt = require('../module/jwt.js');
let travel = require('../module/schema/travelSchema');

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
            "responseMessage" : "Please Add Travel"
        });
    } else {     //등록된 여행이 있을 때
        let newTravels = [];
        var now = new Date();
        let todayFlag = now.getFullYear() + now.getMonth() + now.getDate();
        let newHistory = [];

        for (let i = 0; i < travels.length; i++) {   //하나의 여행 계획에 대하여
            let tvl = travels[i];
            let start = tvl.start;
            let startFlag = start.getFullYear() + start.getMonth() + start.getDate();
            let end = tvl.end;
            let endFlag = end.getFullYear() + end.getMonth() + end.getDate();
            let newTravelJson = new Object();
            let usageBudgetPercentage = 0;

            if ((startFlag <= todayFlag) && (todayFlag <= endFlag)) { //여행이 시작되었을 때
                console.log("here1");
                //총 지출 내역 계산
                let totalUsage = 0;
                let addIncome = 0;
                let histories = tvl.history;
                
                for (let i = 0; i < histories.length; i++) {
                    if (histories[i].isIncome == 0) {
                        totalUsage += histories[i].sum;
                    } else {
                        addIncome += histories[i].sum;
                    }                   
                }

                usageBudgetPercentage = Math.floor((totalUsage / (tvl.balance + addIncome)) * 100);
                console.log(usageBudgetPercentage);

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

                for (let j = 0; j < histories.length; j++) {
                    if (histories[j].isIncome == 0) {   //지출일 때
                        if (histories[j].category == 0) {           //식/음료 일 때
                            food.total += histories[j].sum;
                        } else if (histories[j].category == 1) {    //쇼핑
                            shop.total += histories[j].sum;
                        } else if (histories[j].category == 2) {    //문화
                            culture.total += histories[j].sum;
                        } else if (histories[j].category == 3) {    //숙소
                            acc.total += histories[j].sum;
                        } else {                            //항공
                            flight.total += histories[j].sum;
                        }
                    } else continue;
                }

                let totalSum = food.total + shop.total + culture.total + acc.total + flight.total;
                food.percentage = Math.floor((food.total / totalSum) * 100);
                shop.percentage = Math.floor((shop.total / totalSum) * 100);
                culture.percentage = Math.floor((culture.total / totalSum) * 100);
                acc.percentage = Math.floor((acc.total / totalSum) * 100);
                flight.percentage = Math.floor((flight.total / totalSum) * 100);        

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
                    "balancePercentage" : Math.floor((tvl.balance / tvl.targetSum) * 100),
                    "usageBudgetPercentage" : usageBudgetPercentage,
                    "maxCate" : maxCate
                }
                newTravels.push(newTravelJson);
            } else if (endFlag < todayFlag) {   //여행이 끝났을 때
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
            } else {                    //여행이 시작 전일 때      
                let newTravelJson = {
                    "_id" : tvl._id,
                    "title" : tvl.title,
                    "country" : tvl.country,
                    "diff" : dateDiff(new Date(), tvl.targetDate),
                    "targetSum" : tvl.targetSum,
                    "balance" : tvl.balance,
                    "balancePercentage" : Math.floor((tvl.balance / tvl.targetSum) * 100),
                    "usageBudgetPercentage" : null,
                    "maxCate" : null
                }
                newTravels.push(newTravelJson);
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