const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/numberOfErrors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

module.exports.getUserById = (req, res) => {
  if (req.params.userId.length === 24) {
    User.findById(req.params.userId)
      .then((user) => {
        if (!user) {
          res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
          return;
        }
        res.send(user);
      })
      .catch(() => res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' }));
  } else {
    res.status(BAD_REQUEST).send({ message: 'Ошибка при поиске пользователя' });
  }
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
  } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Валидация не пройдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.dataOfUser = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: 'true',
        runValidators: true,
      },
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Валидация не пройдена' });
        } else {
          res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }
};

module.exports.dataOfUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      {
        new: 'true',
        runValidators: true,
      },
    )
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(BAD_REQUEST).send({ message: 'Валидация не пройдена' });
        } else {
          res.status(NOT_FOUND).send({ message: 'Запрашиваемый пользователь не найден' });
        }
      });
  } else {
    res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
  }
};
