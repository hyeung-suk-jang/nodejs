'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('test',
        {
            idx: { /* column 속성들 */
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                unique: true, /* 여기까지 */
            },
            id_: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            pw_: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            name_: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
        }, {
        timestamps: false,
        tableName: "test"
    });
}
