const express = require("express")
const { Sequelize } = require("sequelize")
const config  = require('config')

const PORT = config.get('port')

const app = express()

const sequelize = new Sequelize(
    config.get("database.name"),
    config.get("database.user"),
    config.get("database.pasword"),
    {
        host: config.get("database.host"),
        port: config.get("database.port"),
        dialect: "postgres",
        logging: false
    }
)


async function start() {
    try {
        await sequelize.authenticate()
        console.log("Database is working!")
        app.listen(PORT, () => console.log("Start app"))
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}


start()