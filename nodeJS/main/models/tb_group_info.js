'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_group_info',
        {
            group_idx: { /* column 속성들 */
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
                unique: true, /* 여기까지 */
            },
            group_nm: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        }, {
        timestamps: false,
        tableName: "tb_group_info"
    });
}
