const Card = require('../models/card');
const {
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
        .then((data) => res.send(data))
        .catch(() => res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Валидация не пройдена' });
      } else {
        res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({ message: 'Ошибка сервера' }));
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndRemove(req.params.cardId)
      .then((card) => {
        if (!card) {
          res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' });
          return;
        }
        res.send({ message: 'Карточка удалена' });
      })
      .catch(() => res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' }));
  } else {
    res.status(BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
  }
};

module.exports.putLike = (req, res) => {
  if (req.params.cardId.length === 24) {
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
        res.send(card);
      })
      .catch(() => res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' }));
  } else {
    res.status(BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
  }
};

module.exports.unputLike = (req, res) => {
  if (req.params.cardId.length === 24) {
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
        res.send(card);
      })
      .catch(() => res.status(NOT_FOUND).send({ message: 'Запрашиваемая карточка не найдена' }));
  } else {
    res.status(BAD_REQUEST).send({ message: 'Некорректный _id карточки' });
  }
};
