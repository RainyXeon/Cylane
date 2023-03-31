const { Router } = require('express')
const { getUserController, getUserMePlaylistController } = require('../controllers/user');
const router = Router()


router.get('/@me', getUserController)

// router.get('/:id/playlist', getUserIdPlaylistController)

router.get('/@me/playlist', getUserMePlaylistController)

module.exports = router


