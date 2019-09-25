'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_company_info',
        {
            company_id : {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                unique: true, /* 여기까지 */
            },
            company_nm : {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            company_desc: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            company_cate_id : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            company_owner_id : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },            
            company_phone : {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            company_addr : {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            company_lat : {
                type: DataTypes.DECIMAL(16,14),
                allowNull: true,
            },
            company_lon : {
                type: DataTypes.DECIMAL(17,14),
                allowNull: true,
            },
            created_date : {
                type: DataTypes.DATE,
                allowNull: true,
            },
            created_by : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            updated_date : {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_by : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        }, {
        timestamps: false,
        tableName: "tb_company_info"
    });
}
