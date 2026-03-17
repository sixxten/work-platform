const express = require("express")
const config  = require('config')
const cookieParser = require('cookie-parser')
const router = require('./routes/index')
const sequelize = require('./db')

const PORT = config.get('port')

const app = express()

app.use(express.json())
app.use(cookieParser()) 

app.use('/api', router)

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

module.exports = { app }

