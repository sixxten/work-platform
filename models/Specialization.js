const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Specialization = sequelize.define("Specialization", {
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
    tableName: 'specializations',
    timestamps: true
});

module.exports = Specialization;