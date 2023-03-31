const express = require('express')
const { Router } = require('express')
const { isAuthenticated } = require('../plugins/middleware')

module.exports = (client) => {
  const router = Router()

  const authRouter = require('./auth')(client)
  const guildsRouter = require('./guilds')
  const usersRouter = require('./user')

  router.use('/auth', authRouter)
  router.use('/guilds', isAuthenticated, guildsRouter)
  router.use('/users', isAuthenticated, usersRouter)


  router.use(express.json())
  router.use(express.urlencoded({ extended: true }))

  return router
} 