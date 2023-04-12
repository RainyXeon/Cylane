const express = require('express')
const app = express()
const logger = require("./logger")
const config = require("./config")

const port = config.all.bot.ALIVE_SERVER_PORT

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(port)

logger.info(`Running alive server in port: ${port}`)