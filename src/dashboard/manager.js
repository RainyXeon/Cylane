const express = require('express')
const cors = require('cors')
const session = require("express-session")
const passport = require('passport')
const store = require("connect-mongo")
const logger = require('./plugins/logger')
const path = require("path")
const { rateLimit } = require("express-rate-limit")
const mongoose = require('mongoose')
require('./strategies/discord.js')

class Manager {
  constructor() {
    this.app = express()
    this.config = require('./plugins/config')

    // mongoose
    // .connect(`${this.config.MONGO_URI}`)
    // .then(() => logger.info('Connected to Database'))
    // .catch((err) => logger.log({ level: "error", message: err }))

    this.logger = logger

    var whitelist = [
      'http://localhost:3000', 
      'http://localhost:3001', 
      'https://www.dreamvast.ml', 
      "https://dreamvast.vercel.router",
      'https://dreamvast.ml',
      undefined
    ]
    
    var corsOptions = {
      origin: function (origin, callback) {
        logger.info(`Requested origin: ${origin}, Allowed: ${whitelist.includes(origin)}`)
        if (whitelist.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
      },
      credentials: true
    }

    this.app.use(cors(corsOptions))

    this.app.use(
      session({
        secret: `${this.config.SIGNATURE}`,
        resave: false,
        saveUninitialized: false,
        cookie: { 
          maxAge: 60000 * 60 * 24 * 3,
          // secure: true
        },
        store: store.create({ 
          mongoUrl: this.config.MONGO_URI
        })
      })
    )

    this.app.use(passport.initialize())
    this.app.use(passport.session())

    process.on('unhandledRejection', error => logger.log({ level: 'error', message: error }))
    process.on('uncaughtException', error => logger.log({ level: 'error', message: error }))

    const handler = (req, res) => res.sendFile(path.join(__dirname, './dash', 'index.html'));

    const routes_name = [
      "/", "/docs/quickstart", "/menu",
      "/dashboard/categories", "/dashboard/language",
      "/dashboard/control", "/docs", "/docs/quickstart",
      "/docs/commands", "/docs/configurations", "/docs/terms",
      "/docs/policy", "/invite", "/login", "/player",
      "/player/select", "/player/panel"
    ]
  
    this.app.use(express.static(path.join(__dirname, './dash')));
  
    routes_name.forEach( route => this.app.get(route, handler) )

    const routes = require('./routes/index.js')(this)

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
      standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
      legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    })

    this.app.use('/api', routes, limiter)

    logger.info("Running")
    return this.app.listen(this.config.PORT);

	}
};

module.exports = Manager;