const { Sequelize } = require("sequelize")
const config = require('config')

const sequelize = new Sequelize(
    config.get("database.name"),
    config.get("database.user"),
    config.get("database.password"),
    {
        host: config.get("database.host"),
        port: config.get("database.port"),
        dialect: "postgres",
        logging: false
    }
)

module.exports = sequelize