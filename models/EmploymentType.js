const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const EmploymentType = sequelize.define("EmploymentType", {
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
    tableName: 'employment_types',
    timestamps: true
});

module.exports = EmploymentType;