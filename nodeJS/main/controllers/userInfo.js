const fs = require('fs')
const path = require('path');
const models = require('../models');
const Sequelize = require('sequelize');


module.exports = {

    getUserInfo: async function (user_email) {
        return await models.tb_user_info.findOne({
            where: { "user_email": user_email }
        });
    },

    getUserFullInfo : async function(user_email) {
        let query = `
            SELECT * 
            FROM TB_USER_INFO UI
                INNER JOIN TB_USER_PHOTO UP ON (UI.USER_ID = UP.USER_ID)
                INNER JOIN TB_FILES FILES ON (UP.FILE_ID = FILES.FILE_ID)
            WHERE UI.USER_EMAIL = :user_email 
            ORDER BY UP.ORDER_NO DESC LIMIT 1
        `;

        let res = await models.sequelize.query(
            query, 
            {
                replacements: {user_email: user_email}, 
                type: Sequelize.QueryTypes.SELECT, 
                raw: true
            });   
        
        if(res.file_stored_name) res.file_stored_name = ''

        return res;
    }
};