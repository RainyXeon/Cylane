const axios = require('axios')
const User =  require('../schemas/User')
const Playlist = require('../schemas/Playlist')
const config = require('../plugins/config')

async function getUserService(id) {
  const user = await User.findById(id)
  if (!user) throw new Error('No user found')
  return axios.get(`${config.DISCORD_API_URL}/users/@me`, {
    headers: { Authorization: `Bearer ${user.accessToken}` }
  })
}

async function getUserMePlaylistService(id) {
  const user = await User.findById(id)
  if (!user) throw new Error('No user found')
  const checkPlaylist = await Playlist.find({ owner: user.discordId, private: true })
  if (checkPlaylist.length == 0) {
    return { msg: "No playlist found" }
  } else {
    return { data: checkPlaylist }
  }
}

module.exports = { getUserService, getUserMePlaylistService }