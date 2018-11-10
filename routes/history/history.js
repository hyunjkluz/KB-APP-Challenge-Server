const express = require('express');
const router = express.Router();
let travel = require('../../module/schema/travelSchema.js');

//미완성
router.get('/:travelId', async (req, res) => {
    let historyTravel = await travel.find({_id : req.params.travelId}).sort({"history.date" : 1});

    if (!historyTravel) {
        res.status(500).send({      //에러
            "responseMessage" : "Internal Server Error"
        });
    } else if (historyTravel.length == 0) {
        res.status(403).send({      //등록된 여행이 하나도 없을 때
            "responseMessage" : "Travel Not Found"
        });
    } else {
        
    }
});

module.exports = router;