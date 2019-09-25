const fs = require('fs')
const path = require('path');
const models = require('../models');
const Sequelize = require('sequelize');


module.exports = {

    insertScheduleProcess : async function(schedule_id) {
        let query = `
            SELECT * FROM TB_SCHEDULE WHERE SCHEDULE_ID = :schedule_id
        `;

        let scheduleInfo = await models.sequelize.query(
            query, 
            {
                replacements: {schedule_id: schedule_id}, 
                type: Sequelize.QueryTypes.SELECT, 
                raw: true
            });
        scheduleInfo = scheduleInfo[0];
        
        const schedule_start_date = scheduleInfo.schedule_start_date;
        const schedule_end_date = scheduleInfo.schedule_end_date;
        const schedule_weekday = JSON.parse(scheduleInfo.schedule_weekday);
        const schedule_start_time = scheduleInfo.schedule_start_time;
        const schedule_end_time = scheduleInfo.schedule_end_time;

        let yyyy = schedule_start_date.substr(0,4);
        let mm = schedule_start_date.substr(4,2);
        let dd = schedule_start_date.substr(6,2);

        let start_date = new Date(yyyy,mm-1,dd);

        yyyy = schedule_end_date.substr(0,4);
        mm = schedule_end_date.substr(4,2);
        dd = schedule_end_date.substr(6,2);

        let end_date = new Date(yyyy,mm-1,dd);
        let date_list = [];

        while (true){
            if(schedule_weekday.indexOf(start_date.getDay()) > -1 ) {
                date_list.push({
                    "targetDate" : dateConverter(start_date), "day" : start_date.getDay()});
            } 
            start_date.setDate(start_date.getDate() + 1);
            console.log(start_date);

            if(start_date.getMilliseconds === end_date.getMilliseconds)  break;

        }
        console.log(date_list);

        function dateConverter (date) {

            var mm = date.getMonth() + 1; // getMonth() is zero-based
            var dd = date.getDate();
          
            return [date.getFullYear(),
                    (mm>9 ? '' : '0') + mm,
                    (dd>9 ? '' : '0') + dd
                   ].join('');
                }
    
        
        return null;
    }
};