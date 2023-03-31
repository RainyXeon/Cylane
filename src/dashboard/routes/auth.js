const { Router, Request, Response } = require('express')
const passport = require('passport')

module.exports = (client) => {

  const router = Router()

  router.get('/discord', passport.authenticate('discord'), (req, res) => {
    res.sendStatus(200)
  })

  router.get('/discord/redirect', passport.authenticate('discord'), async (req, res) => {
    return res.redirect(client.config.REDIRECT)
  })


  router.get('/status', (req, res) => {
    return req.user 
      ? res.status(200).send(req.user)
      : res.status(401).send({ msg: 'Unauthorized' })
  })

  return router
}