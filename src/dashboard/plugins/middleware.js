const isAuthenticated = async (req, res, next) => 
{ 
  if (req.user) return next() 
  else return res.status(403).send({ msg: 'Unauthorized' }) 
}

module.exports = { isAuthenticated }