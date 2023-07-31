const { ValidationError, CastError } = require('mongoose').Error;
const Card = require('../models/card');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require('../errors/numberOfErrors');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res
          .status(OK)
          .send(data))
        .catch(() => res
          .status(NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' }));
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Валидация не пройдена' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res
      .status(OK)
      .send(cards))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка сервера' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res
          .status(NOT_FOUND)
          .send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res
        .status(OK)
        .send({ message: 'Карточка удалена' });
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

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res
        .status(OK)
        .send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для постановки "Мне нравится".' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера.' });
      }
    });
};

module.exports.unputLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
        return;
      }
      res
        .status(OK)
        .send(card);
    })
    .catch((err) => {
      if (err instanceof CastError) {
        res
          .status(BAD_REQUEST)
          .send({ message: 'Переданы некорректные данные для снятия "Мне нравится".' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: 'Ошибка сервера.' });
      }
    });
};
