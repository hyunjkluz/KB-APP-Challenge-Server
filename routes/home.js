const express = require('express');
const router = express.Router();
const jwt = require('../module/jwt.js');


router.get('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);
    let user_idx = decoded.user_idx;

    let selectTravelQuery = 'SELECT *, DATEDIFF(day, SYSDATE, t.travel_target_date) as "rest_day" t.travel_target_budget-a.account_budget as "rest_budget"' 
                        + 'FROM travel as t JOIN account as a USING(travel_idx) ' 
                        + 'WHERE t.user_idx = ?';
    let selectTravelResult = await db.queryParam_Arr(selectTravelQuery, [user_idx]);

    if (!selectTravelResult) {
        res.status(500).send({
            "statusCode" : 500,
            "responseMessage" : "Internal Server Error"
        });
    } else if (selectTravelResult.length == 0) {
        res.status(200).send({
            "statusCode" : 200,
            "responseMessage" : "새로운 여행이 필요합니다."
        });
    } else {
        var month_dic = [];
        for (let i = 0; i < selectTravelResult.length; i++) {
            let selectAccountQuery = 'SELECT * FROM WHERE';
        
            //if (!())
        }
        
    }
});



module.exports = router;