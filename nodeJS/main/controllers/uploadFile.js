const fs = require('fs')
const path = require('path');
const models = require('../models');
const userInfo = require('./userInfo');
global.filePath = 'C:\\nodeJS_upload/';

module.exports = {

    createImg: function (req, res, next) {

        let saveImage = function () {

            let possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
            let imgUrl = Date.now();

            for (var i = 0; i < 6; i += 1) {
                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            let user_id = req.body;
            let mimetype = req.file.mimetype;
            let orignialname = req.file.originalname;
            let tempPath = req.file.path
            let ext = path.extname(req.file.originalname).toLowerCase(); //path.extname(url) 파일 확장자 축출
            imgUrl += ext;
            let targetPath = path.resolve(filePath + imgUrl);

            if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
                //fs(파일시스템).rename( 원본파일, 새로운파일, 콜백함수 )
                fs.rename(tempPath, targetPath, function (err) {
                    if (err) throw err;
                    console.log(imgUrl);
                    module.exports.insertFile(req.file, imgUrl, req, res);
                    //res.redirect('/images/'+imgUrl);
                });
            } else {
                fs.unlink(tempPath, function () {
                    res.status(500).json({ error: 'Only image files are allowed.' });
                });
            }
        };
        saveImage();
    },

    insertFile: async function (file, storedName, req, res) {

        const paramId = req.body || req.query;
        //const user_id = paramId.user_id;

        const user = await userInfo.getUserInfo(paramId.user_email);
        const user_id = user.user_id;
        let date_ = Date.now();

        let param = {
            file_rel_name: file.originalname,
            file_stored_name: storedName,
            file_type: file.mimetype,
            created_by: user_id,
            updated_by: user_id,
            created_Date: date_
        }

        models.tb_files.create(param).then(result => {
            console.log(result);
            let returnJson = {
                "resultCode" : 1,
                "resultMsg" : "이미지 업로드 완료",
                "resultData" : result
            }

            res.json(returnJson);
            module.exports.registerImg(user_id,result.file_id);
        });
    },

    registerImg: (user_id, file_id) => {
        let param = {
            user_id: user_id
        }
        models.tb_user_photo.max('order_no',{where : param}).then(result =>{
            console.log(result);
            param.order_no = isNaN(result) ? 0 : result+1;
            param.file_id = file_id;
            models.tb_user_photo.create(param).then(result => {
                console.log(result);            
            })
        })
    },

    loadFile: (param) => {
        models.tb_files.findAll(param).then(result => {
            console.log(result);
        });
    }
};