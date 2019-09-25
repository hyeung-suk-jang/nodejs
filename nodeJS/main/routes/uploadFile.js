const express = require('express');
const models = require('../models');
const router = express.Router();
const multer = require('multer');

const uploadFile = require('../controllers/uploadFile');


const upload = multer({ dest: require('path').join(__dirname, 'public/upload/temp') });

router.route('/img')
    .post(upload.single('img'), uploadFile.createImg);


module.exports = router;
