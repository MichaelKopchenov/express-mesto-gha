module.exports = class STATUS_OK extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200;
  }
};
