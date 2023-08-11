const jwt = require('jsonwebtoken');
const UNATHORIZED_ERROR = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UNATHORIZED_ERROR('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UNATHORIZED_ERROR('Необходима авторизация');
  }
  req.user = payload;
  next();
};
