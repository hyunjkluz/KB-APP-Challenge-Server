const express = require('express');
const router = express.Router();
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//계좌 상세보기
router.get('/:account_idx', async (req, res) => {
    let account_idx = req.params.account_idx;

    let selectAccountQuery = 'SELECT * FROM account WHERE account_idx = ?';
    let selectAccountResult = await db.queryParam_Arr(selectAccountQuery, [account_idx]);

    if (!selectAccountResult) {
        res.status(500).send({
            "statusCode" : 500,
            "responseMessage" : "해당 계좌를 찾을 수 없습니다."
        });
    } else {
        res.status(200).send({
            "statusCode" : 200,
            "responseMessage" : "성공적으로 계좌 정보를 확인하였습니다.",
            "responseData" : selectAccountResult
        });
    }
});

//계좌 등록
router.post('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);
    let user_idx = decoded.user_idx;

    let account_bank = req.body.bank;
    let account_number = req.body.number;
    let account_name = req.body.name;
    
    if (!account_bank || !account_number || !account_name) {
        res.status(400).send({
            "statusCode" : 400,
            "responeMessage" : "필요한 값이 없습니다."
        });
    } else {
        let insertAccountQuery = 'INSERT INTO account VALUES (?, ?, ?, ?)';
        let insertAccountResult = await db.queryParam_Arr(insertAccountQuery, [account_bank, account_number, account_name, user_idx]);

        if (!insertAccountResult) {
            res.status(500).send({
                "statusCode" : 500,
                "responseMessage" : "서버 내부 오류"
            });
        } else {
            res.status(200).send({
                "statusCode" : 200,
                "responseMessage" : "성공적으로 계좌를 등록 완료하였습니다.",
                "responseData" : {
                    "account_idx" : parseInt(insertAccountResult.insertId)
                }
            });
        }
    }
});

//계좌 수정
router.post('/', async (req, res) => {
    let account_idx = req.body.account_idx;
    let account_name = req.body.name;
    
    if (!account_idx || !account_name) {
        res.status(400).send({
            "statusCode" : 400,
            "responeMessage" : "필요한 값이 없습니다."
        });
    } else {
        let updateAccountQuery = 'UPDATE account SET account_name = ? WHERE account_idx = ?';
        let updateAccountResult = await db.queryParam_Arr(updateAccountQuery, [account_name, account_idx]);

        if (!updateAccountResult) {
            res.status(500).send({
                "statusCode" : 500,
                "responseMessage" : "서버 내부 오류"
            });
        } else {
            res.status(200).send({
                "statusCode" : 200,
                "responseMessage" : "성공적으로 계좌 수정을 완료하였습니다.",
                "responseData" : {
                    "account_idx" : account_idx
                }
            });
        }
    }
});

//계좌 삭제
router.delete('/:account_idx', async (req, res) => {
    let account_idx = req.params.account_idx;

    let deleteAccountQuery = 'DELETE FROM account WHERE acount_idx = ?';
    let deleteAccountResult = await db.queryParam_Arr(deleteAccountQuery, [account_idx]);

    if (!deleteAccountResult) {
        res.status(500).send({
            "statusCode" : 500,
            "responseMessage" : "해당 계좌를 삭제할 수 없습니다."
        });
    } else {
        res.status(200).send({
            "statusCode" : 200,
            "responseMessage" : "성공적으로 계좌 정보를 삭제하였습니다.",
            "responseData" : deleteAccountResult
        });
    }
});

module.exports = router;





