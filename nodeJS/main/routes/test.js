var express = require('express');
var models = require('../models');
var router = express.Router();


router.route('/')
    .get(function (req, res, next) {
        models.sequelize.query('SELECT * FROM test',
        {replacements: {}
      }).then(function(results,metadata) {
       res.json(results);
      });
    })
    .post(function (req, res, next) {
        models.test.findAll({
           
        }).then(function (result) {
            res.json(result);
        }).catch(function (err) {
            console.log(err);
            next(1005);
        });
    });

module.exports = router;
