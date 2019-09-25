'use strict';
module.exports = (sequelize, DataTypes) => {
    return sequelize.define('tb_files',
        {
            file_id: { /* column 속성들 */
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                unique: true, /* 여기까지 */
            },
            file_rel_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            file_stored_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            file_type: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            updated_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            updated_date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        }, {
        timestamps: false,
        tableName: "tb_files"
    });
}
