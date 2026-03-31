const { DataTypes } = require("sequelize");
const sequelize = require("../db");


const StudentProfile = sequelize.define("StudentProfile", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    fullName: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    group: {
        type: DataTypes.STRING(50),
        allowNull: true
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
        allowNull: true,
        get() {
            const raw = this.getDataValue('contacts');
            return raw ? JSON.parse(raw) : {};
        },
        set(value) {
            this.setDataValue('contacts', JSON.stringify(value));
        }
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'student_profiles',
    timestamps: true
});

module.exports = StudentProfile;