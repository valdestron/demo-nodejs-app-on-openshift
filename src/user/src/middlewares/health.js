module.exports = (req, res, next) => {
  res.sendStatus(200)
  return next()
}
