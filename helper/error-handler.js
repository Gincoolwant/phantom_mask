module.exports = {
  errorHandler (err, req, res, next) {
    res.status(500).json({
      status: 'Internal Server Error',
      type: `${err.name}`,
      message: err.message
    })
  }
}
