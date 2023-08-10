const { HTTP_STATUS_OK } = require('http2').constants;
const {
  ValidationError,
  CastError,
  DocumentNotFoundError,
} = require('mongoose').Error;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res
        .status(HTTP_STATUS_OK)
        .send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(`Пользователь с email: ${email} уже зарегистрирован`));
      } else if (err instanceof ValidationError) {
        next(new BadRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(HTTP_STATUS_OK).send(users))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res
        .status(HTTP_STATUS_OK)
        .send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        next(new BadRequestError(`Некорректный _id: ${req.params.userId}`));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по указанному _id: ${req.params.userId} не найден.`));
      } else {
        next(err);
      }
    });
};

module.exports.dataOfUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((users) => res
      .status(HTTP_STATUS_OK)
      .send(users))
    .catch(next);
};

module.exports.editdataOfUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: 'true', runValidators: true },
  )
    .orFail()
    .then((user) => res
      .status(HTTP_STATUS_OK)
      .send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по указанному _id: ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
};

module.exports.editdataOfUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: 'true', runValidators: true },
  )
    .orFail()
    .then((user) => res
      .status(HTTP_STATUS_OK)
      .send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err instanceof DocumentNotFoundError) {
        next(new NotFoundError(`Пользователь по указанному _id: ${req.user._id} не найден.`));
      } else {
        next(err);
      }
    });
};
