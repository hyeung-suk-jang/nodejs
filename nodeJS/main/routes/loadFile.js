const express = require('express');
const models = require('../models');
const router = express.Router();

router.route('/img')
    .post((req, res, next) => {

        const paramId = req.body || req.query;


        res.json("test");

    });


module.exports = router;
