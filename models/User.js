const { DataTypes } = require("sequelize")
const { sequelize } = require("../app")

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'student', 
        validate: {
            isIn: [['student', 'employer']]
        }
    }
}, {
    tableName: 'users',
    timestamps: true 
})

module.exports = User