var express = require('express');
var models = require('../models');
var router = express.Router();
var bcrypt = require('bcryptjs');

router.route('/').post(function (req, res, next) {
    const user_email = req.body.user_email;
    const user_pw = req.body.user_pw;
    models.tb_user_info.findOne({
        where: { "user_email": user_email }
    })
    .then(function(user_info) {
        const isSync = user_info ? bcrypt.compareSync(user_pw ,user_info.user_pw) : false;
        const resultData = user_info ? {
            "user_id" : user_info.user_id,
            "user_email" : user_info.user_email,
            "group_id" : user_info.group_id,
            "user_phone" : user_info.user_phone,
            "user_nm" : user_info.user_nm
        } : {};
        res.json({
            "resultCode" : user_info && isSync ? 1 : 0,
            "resultMsg" : user_info && isSync ? "로그인 성공" : "로그인 실패",
            "resultData" : user_info && isSync ? resultData : null
        })
    })
})

module.exports = router;