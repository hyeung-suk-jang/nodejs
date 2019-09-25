var express = require('express');
var models = require('../models');
var scheduleService = require('../controllers/schedule');
var router = express.Router();


router.route('/list').get(async function (req, res, next) {

    const user_info = await models.tb_schedule.findAll({
        where: { schedule_isadvertise : 'Y' }
    });

    let result = {
        "resultCode" : 1,
        "resultMsg" : "스케줄 리스트 로드 완료",
        "resultData" : user_info         
    }
    res.json(result);    
});

router.route('/list').post(async function (req, res, next) {

    const user_info = await models.tb_schedule.findAll({
        where: { schedule_isadvertise : 'Y' }
    });

    let result = {
        "resultCode" : 1,
        "resultMsg" : "스케줄 리스트 로드 완료",
        "resultData" : user_info         
    }
    res.json(result);
});

router.route('/doProcess').post(async function (req, res, next) {

    const paramId = req.body || req.query;

    const schedule_id = paramId.schedule_id;

    let res2 = await scheduleService.insertScheduleProcess(schedule_id);


    let result = {
        "resultCode" : 1,
        "resultMsg" : "스케줄 리스트 로드 완료",
        "resultData" : null         
    }
    res.json(result);
})


module.exports = router;