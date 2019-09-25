'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_user_info',
        {
            user_id: { /* column 속성들 */
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                unique: true, /* 여기까지 */
            },
            user_email: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            user_pw: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            group_id: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            user_phone: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            user_nm: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            created_date: {
                type:DataTypes.DATE,
                allowNull: true,
            },
            updated_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
        timestamps: false,
        tableName: "tb_user_info"
    });
}
