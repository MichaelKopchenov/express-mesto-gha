module.exports = class CONFLICT_ERROR extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
};
