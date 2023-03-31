const { Strategy } = require('passport-discord')
const passport = require('passport')
const User = require("../schemas/User")
const config = require('../plugins/config')
const logger = require('../plugins/logger')

passport.serializeUser((user, done) => {
  return done(null, user.id)
})
    
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id)
    return user ? done(null, user) : done(null, null)
  } catch(err) {
    console.log(err)
    return done(err, null)
  }
})
    
passport.use(
  new Strategy({
    clientID: config.DISCORD_CLIENT_ID,
    clientSecret: config.DISCORD_CLIENT_SECRET,
    callbackURL: config.DISCORD_REDIRECT_URL,
    scope: ['identify', 'guilds']
  }, async (accessToken, refreshToken, profile, done) => 
    {
      logger.info(accessToken, refreshToken)
      const { id: discordId } = profile
      try {
        const existUser = await User.findOneAndUpdate(
          { discordId }, 
          { accessToken, refreshToken },
          { new: true }
        )
        logger.info(`Existing User ${existUser}`)
        if (existUser) return done(null, existUser)
        const newUser = new User({ discordId, accessToken, refreshToken })
        const savedUser = await newUser.save()
        return done(null, savedUser)
      } catch (err){
        logger.log({ level: "error", message: err })
        return done(err, undefined)
      }
    }
  ) 
)



