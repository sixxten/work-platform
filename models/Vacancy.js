const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Vacancy = sequelize.define("Vacancy", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    company: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    location: {
        type: DataTypes.STRING(200),
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('active', 'closed', 'draft'),
        defaultValue: 'active'
    },
    // Внешние ключи
    employerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    employmentTypeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'employment_types',
            key: 'id'
        }
    },
    workFormatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'work_formats',
            key: 'id'
        }
    },
    specializationId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'specializations',
            key: 'id'
        }
    }
}, {
    tableName: 'vacancies',
    timestamps: true
});

module.exports = Vacancy;