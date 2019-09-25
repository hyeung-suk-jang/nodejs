'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_user_photo',
        {            
            photo_id: { /* column 속성들 */
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                unique: true, /* 여기까지 */
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            file_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            order_no: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        }, {
        timestamps: false,
        tableName: "tb_user_photo"
    });
}
