const express = require('express');
const router = express.Router();
let user = require('../../module/schema/userSchema.js');
const jwt = require('../../module/jwt.js');

//회원가입
router.post('/signup', async (req, res) => {
    await user.create({
        id : req.body.id,
        name: req.body.name,
        pw: req.body.pw,
        phone: req.body.phone
    }, async (err, users) => {
        if (err) {
            res.status(500).send({
                "responseMessage" : "Internal Server Error : Insert"
            });
        } else {
            res.status(200).send({
                "responseMessage" : "Successfully Registe User"
            });            
        }
    });    
});

//로그인
router.post('/signin', async (req, res) => {
    let id = req.body.id;
    let pw = parseInt(req.body.pw);

    if (!id || !pw) {
        res.status(400).send({
            "statusCode" : 400,
            "responseMessage" : "Null Value"
        });
    } else {
        let selectUser = await user.find({ "id" : id});
        if (!selectUser) {
            res.status(500).send({
                "responseMessage" : "Internal Server Error"
            });
        } else {

            if (selectUser[0].pw == pw) {
                let userId = selectUser[0]._id;
                let token = jwt.sign(userId);
                res.status(200).send({
                    "responseMessage" : "Login Success",
                    "responseData" : {
                        "token" : token
                    }
                });
            } else {
                res.status(500).send({
                    "responseMessage" : "No User"
                });
            }
        }
    }    
});

module.exports = router;

