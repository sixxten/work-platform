const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const WorkFormat = sequelize.define("WorkFormat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    slug: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'work_formats',
    timestamps: true
});

module.exports = WorkFormat;