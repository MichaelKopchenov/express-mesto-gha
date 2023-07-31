const { ValidationError, CastError } = require('mongoose').Error;
const User = require('../models/user');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/numberOfErrors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res
      .status(OK)
      .send(users))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка сервера.' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res
        .status(OK)
        .send(user);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.dataOfUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res
      .status(OK)
      .send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.editdataOfUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: 'true', runValidators: true },
  )
    .then((user) => res
      .status(OK)
      .send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
    });
};

module.exports.editdataOfUserAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: 'true', runValidators: true },
  )
    .then((user) => res
      .status(OK)
      .send(user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные.' });
      } else {
        res
          .status(NOT_FOUND)
          .send({ message: 'Пользователь по указанному _id не найден.' });
      }
    });
};
