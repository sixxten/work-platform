const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Chat = sequelize.define("Chat", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    vacancyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'vacancies',
            key: 'id'
        }
    },
    studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    lastMessage: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    lastMessageAt: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'chats',
    timestamps: true
});

const Vacancy = require('./Vacancy');
const User = require('./User');

Chat.belongsTo(Vacancy, { foreignKey: 'vacancyId', as: 'vacancy' });
Chat.belongsTo(User, { foreignKey: 'studentId', as: 'student' });
Chat.belongsTo(User, { foreignKey: 'employerId', as: 'employer' });

module.exports = Chat;