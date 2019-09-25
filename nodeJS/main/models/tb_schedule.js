'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_schedule',
        {
            schedule_id : {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                unique: true, /* 여기까지 */
            },
            schedule_nm : {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            schedule_start_date : {
                type: DataTypes.STRING(8),
                allowNull: true,
            },
            schedule_end_date : {
                type: DataTypes.STRING(8),
                allowNull: true,
            },
            schedule_recruit_numbers : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            schedule_weekday : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            schedule_isadvertise : {
                type: DataTypes.STRING(1),
                allowNull: true,
            },
            company_id : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            schedule_desc : {
                type: DataTypes.STRING(2000),
                allowNull: true,
            },
            schedule_start_time : {
                type: DataTypes.STRING(4),
                allowNull: true,
            },
            schedule_end_time : {
                type: DataTypes.STRING(4),
                allowNull: true,
            },
            schedule_pay : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        }, {
        timestamps: false,
        tableName: "tb_schedule"
    });
}