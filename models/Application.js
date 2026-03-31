const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Application = sequelize.define("Application", {
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
    fullName: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    group: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true,
        get() {
            const raw = this.getDataValue('skills');
            return raw ? JSON.parse(raw) : [];
        },
        set(value) {
            this.setDataValue('skills', JSON.stringify(value));
        }
    },
    contacts: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    additionalInfo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'),
        defaultValue: 'pending'
    }
}, {
    tableName: 'applications',
    timestamps: true
});

module.exports = Application;