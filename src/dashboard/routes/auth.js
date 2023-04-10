const { Router, Request, Response } = require('express')
const passport = require('passport')
const jwt = require('jsonwebtoken');

module.exports = (client) => {

  const router = Router()

  router.get('/discord', passport.authenticate('discord'), (req, res) => {
    res.sendStatus(200)
  })

  router.get('/discord/redirect', passport.authenticate('discord'), async (req, res) => {
  
    const userReq = req.user
    
    const UToken = await Token.findOne({ discordId: userReq.discordId });
  
    const expires_data = req.session.cookie.expires
  
    const date = new Date(expires_data);
  
    const milliseconds = date.getTime(); 
  
    if (UToken) 
    {
      const get_token = UToken.token
  
      const redirect_url = 
      `${client.config.REDIRECT}` 
      + "/?connect-token=" + get_token
      + "&expires=" + UToken.expires
  
      console.log("Existed token" + UToken)
  
      return res.redirect(redirect_url)
    }
  
    if (!UToken) 
    {
      const token_code = jwt.sign({ accessToken: userReq.accessToken }, client.config.SIGNATURE, { expiresIn:  milliseconds });
  
      console.log(`Generated token: ${token_code}`)
  
      const SaveToken = new Token({
        discordId: userReq.discordId,
        accessToken: userReq.accessToken,
        refreshToken: userReq.refreshToken,
        schemasId: userReq.id,
        token: token_code[0],
      });
  
      console.log("New Token: " + SaveToken)
  
      SaveToken.save().catch((err) => console.log(err))
  
      const redirect_url = 
      `${client.config.REDIRECT}` 
      + "/?connect-token=" + token_code
      + "&expires=" + milliseconds
  
      return res.redirect(redirect_url)

    }

  })


  router.get('/status', (req, res) => {
    return req.user 
      ? res.status(200).send(req.user)
      : res.status(401).send({ msg: 'Unauthorized' })
  })

  return router
}