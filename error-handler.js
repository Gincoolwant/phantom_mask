module.exports = {
  errorHandler (err, req, res, next) {
    if (err instanceof Error) {
      res.status(err.status || 500).json({
        status: 'error',
        type: `${err.name}: ${err.message}`,
        message: err.message
      })
    } else {
      res.status(500).json({
        status: 'logical process error',
        type: `error500, ${err.name}: ${err.message}`,
        message: err.message
      })
    }
  }
}
