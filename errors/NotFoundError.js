module.exports = class NOT_FOUND_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
};
