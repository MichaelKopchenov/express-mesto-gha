class UNATHORIZED_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = UNATHORIZED_ERROR;
