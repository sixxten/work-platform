const { DataTypes } = require("sequelize")
const { sequelize } = require("../app")

const RefreshToken = sequelize.define('RefreshToken', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'refresh_tokens',
    timestamps: true
})


User.hasMany(RefreshToken, { foreignKey: 'userId' })
RefreshToken.belongsTo(User, { foreignKey: 'userId' })

module.exports = RefreshToken