var express = require('express');
var models = require('../models');
var router = express.Router();
var bcrypt = require('bcryptjs');
var userInfoMap = require('../controllers/userInfo');

router.route('/:id').get(async function (req, res, next) {
    const user_id = req.params.id;
    const user_info = await models.tb_user_info.findOne({
        where: { user_id : user_id }
    });
    if (user_info) {
        res.json({
            "resultCode" : 1,
            "resultMsg" : "유저 정보 조회",
            "resultData" : {
                "user_id" : user_info.user_id,
                "user_email" : user_info.user_email,
                "group_id" : user_info.group_id,
                "user_phone" : user_info.user_phone,
                "user_nm" : user_info.user_nm
            }
        })
    } else {
        res.json({
            "resultCode" : 0,
            "resultMsg" : "존재하지 않는 회원입니다.",
            "resultData" : null
        })
    }
})


router.route('/').post(async function (req, res, next) {
    const paramId = req.body || req.query;
    const user_email = paramId.user_email;

    let test = await userInfoMap.getUserFullInfo(user_email);
    
    res.json(test);
})


router.route('/withdraw').post(async function(req, res, next) {
    const user_id = req.body.user_id;
    const result = await models.tb_user_info.destroy({
        where : { user_id : user_id }
    })
    res.json({
        "resultCode" : 1,
        "resultMsg" : "회원탈퇴가 성공적으로 진행되었습니다.",
        "resultData" : null
    })
});

router.route('/update').post(async function(req, res, next) {

    const user_id = req.body.user_id;
    const user_pw = req.body.user_pw;
    const user_info = await models.tb_user_info.findOne({
        where: { "user_email": req.body.user_email }
    })

    if(user_info == null) {
        res.json({
            "resultCode" : 0,
            "resultMsg" : "없는 계정입니다.",
            "resultData" : null
        })
    }
    const isSync = user_info ? bcrypt.compareSync(user_pw ,user_info.user_pw) : false;

    if(isSync){
        res.json({
            "resultCode" : 0,
            "resultMsg" : "패스워드 일치 하지 않음",
            "resultData" : null
        })
    }

    const user_form = {
        "user_email" : req.body.user_email,
        "user_pw" : bcrypt.hashSync(req.body.new_user_pw, 8),
        "user_nm" : req.body.user_nm,
        "group_id" : req.body.group_id,
        "user_phone" : req.body.user_phone
    };
    // const isDuplicated = await models.tb_user_info.findOne({
    //     where: { "user_email": req.body.user_email }
    // });
    if (false) {
        res.json({
            "resultCode" : 0,
            "resultMsg" : "이메일이 이미 존재합니다.",
            "resultData" : null
        })
    } else {
        models.tb_user_info.update(
            user_form,{
                where: { "user_email" : user_form.user_email}
            })
        .then(function(user_info) {
            res.json({
                "resultCode" : 1,
                "resultMsg" : "회원 수정이 완료되었습니다..",
                "resultData" : {
                
                }
            })
        })
    }
});


module.exports = router;