const { getUserService, getUserMePlaylistService } = require('../services/user')

async function getUserController(req, res) {
  const user = req.user
  try {
    const { data: userFetch } = await getUserService(user.id)
    res.send(userFetch)
  } catch (err){
    console.log(err)
    res.status(400).send('Error')
  }
}

async function getUserMePlaylistController(req, res) {
  const user = req.user
  try {
    const playlist = await getUserMePlaylistService(user.id)
    res.send(playlist)
  } catch (err){
    console.log(err)
    res.status(400).send('Error')
  }
}

module.exports = { getUserController, getUserMePlaylistController }