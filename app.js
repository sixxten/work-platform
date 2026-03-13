const express = require("express")
const { Sequelize } = require("sequelize")
const config  = require('config')
const cookieParser = require('cookie-parser')

const PORT = config.get('port')

const app = express()

app.use(express.json({ extended: true }))
app.use(cookieParser()) 


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
module.exports = { app, sequelize }

app.use('/api/auth', require('./routes/auth.routes'))

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


