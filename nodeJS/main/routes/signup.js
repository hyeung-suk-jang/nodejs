var express = require('express');
var models = require('../models');
var router = express.Router();
var bcrypt = require('bcryptjs');

router.route('/').post(async function (req, res, next) {
    const user_form = {
        "user_email" : req.body.user_email,
        "user_pw" : bcrypt.hashSync(req.body.user_pw, 8),
        "user_nm" : req.body.user_nm,
        "group_id" : req.body.group_id,
        "user_phone" : req.body.user_phone
    };
    const isDuplicated = await models.tb_user_info.findOne({
        where: { "user_email": req.body.user_email }
    });
    if (isDuplicated) {
        res.json({
            "resultCode" : 0,
            "resultMsg" : "이메일이 이미 존재합니다.",
            "resultData" : null
        })
    } else {
        models.tb_user_info.create(user_form)
        .then(function(user_info) {
            res.json({
                "resultCode" : 1,
                "resultMsg" : "회원가입이 완료되었습니다.",
                "resultData" : {
                    "user_id" : user_info.user_id,
                    "user_email" : user_info.user_email,
                    "group_id" : user_info.group_id,
                    "user_phone" : user_info.user_phone,
                    "user_nm" : user_info.user_nm
                }
            })
        })
    }
})


// router.route('/group').post(async function(req, res, next) {
//     const group_id = req.body.group_id;
//     const user_id = req.body.user_id;
//     console.log(user_id)
//     // 관리자
//     if (group_id == 0) {
//         //TODO: 관리자 회원가입
//     } else if (group_id == 1) {
//         const user_info = await models.tb_user_info.findOne({
//             where : { "user_id" : user_id }
//         });
//         await user_info.update({
//             "group_id" : group_id 
//         })
//         res.json({
//             "resultCode" : 1,
//             "resultMsg" : "개인회원으로 등록되었습니다.",
//             "resultData" : {
//                 "user_id" : user_info.user_id,
//                 "user_email" : user_info.user_email,
//                 "group_id" : user_info.group_id,
//                 "user_phone" : user_info.user_phone,
//                 "user_nm" : user_info.user_nm
//             }
//         })
//     }
// })

module.exports = router;