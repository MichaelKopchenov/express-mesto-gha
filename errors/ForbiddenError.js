module.exports = class FORBIDDEN_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
};
