const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const crypto = require('crypto-promise');

//회원가입
router.post('/signup', async (req, res) => {
    let user_id = req.body.id;
    let user_pw = req.body.pw;
    let user_name = req.body.name;
    let user_age = req.body.age;
    let user_id_card_num = req.body.id_card_num;

    if (!user_id || !user_pw) {
        res.status(400).send({
            "statusCode" : 400,
            "responeMessage" : "필요한 값이 없습니다."
        });
    } else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?';
        let checkResult = await db.queryParam_Arr(checkQuery, [user_id]);

        if (!checkResult) {
            res.status(500).send({
                "statusCode" : 500,
                "responseMessage" : "서버 내부 오류"
            });
        } else if (checkResult.length == 1) {
            res.status(400).send({
                "statusCode" : 400,
                "responseMessage" : "해당 아이디가 이미 존재합니다."
            });

        } else {
            const salt = await crypto.randomBytes(32);
            const hashedpw = await crypto.pbkdf2(user_pw, salt.toString('base64'), 100000, 32, 'sha512');

            let insertUserQuery = 'INSERT INTO user () VALUES ( )';
            let insertUserResult = await db.queryParam_Arr(insertUserQuery, [user_id, hashedpw.toString('base64'), salt.toString('base64'), user_name, user_age, user_id_card_num]);

            if (!insertUserResult) {
                res.status(500).send({
                    "statusCode" : 500,
                    "responseMessage" : "서버 내부 오류"
                });
            } else {
                res.status(200).send({
                    "statusCode" : 200,
                    "responseMessage" : "성공적으로 회원가입이 완료되었습니다."
                })
            }
        }
    }
});

//로그인
router.post('/signin', async (Req, res) => {
    let user_id = req.body.id;
    let user_pw = req.body.pw;

    if (!user_id ||!user_pw) {
        res.status(400).send({
            "statusCode" : 400,
            "responseMessage" : "Null Value"
        });
    } else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?';
        let checkResult = await db.queryParam_Arr(checkQuery, [user_id]);

        if (!checkResult) {
            res.status(500).send({
                "statusCode" : 500,
                "responseMessage" : "해당 id를 가진 회원이 없습니다."
            });
        } else if (checkResult.length == 1) {
            const hashedpw = await crypto.pbkdf2(user_pw, salt.toString('base64'), 100000, 32, 'sha512');

            if (hashedpw.toString('base64') === checkResult[0].user_pw) {
                res.status(200).send({
                    "statusCode" : 200,
                    "responseMessage" : "성공적으로 로그인되었습니다."
                });
            } else {
                res.status(400).send({
                    "statusCode" : 400,
                    "responseMessage" : "비밀번호가 틀렸습니다."
                });
            }
        } else {
            res.status(400).send({
                "statusCode" : 400,
                "responseMessage" : "ID가 틀렸습니다" 
            });

        }
    }
    
});

