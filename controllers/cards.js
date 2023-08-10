const { ValidationError, CastError, DocumentNotFoundError } = require('mongoose').Error;
const Card = require('../models/card');
const { STATUS_OK } = require('../errors/StatusOk');
const { BAD_REQUEST_ERROR } = require('../errors/BadRequestError');
const { NOT_FOUND_ERROR } = require('../errors/NotFoundError');
const { FORBIDDEN_ERROR } = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => {
      Card.findById(card._id)
        .orFail()
        .populate('owner')
        .then((data) => res
          .status(STATUS_OK)
          .send(data))
        .catch((err) => {
          if (err instanceof DocumentNotFoundError) {
            next(new NOT_FOUND_ERROR('Карточка с указанным _id не найдена.'));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BAD_REQUEST_ERROR(err.message));
      } else {
        next(err);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res
      .status(STATUS_OK)
      .send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        throw new FORBIDDEN_ERROR('Карточка другого пользовател');
      }
      Card.deleteOne(card)
        .orFail()
        .then(() => {
          res
            .status(STATUS_OK)
            .send({ message: 'Карточка удалена' });
        })
        .catch((err) => {
          if (err instanceof DocumentNotFoundError) {
            next(new NOT_FOUND_ERROR(`Карточка с _id: ${req.params.cardId} не найдена.`));
          } else if (err instanceof CastError) {
            next(new BAD_REQUEST_ERROR(`Некорректный _id карточки: ${req.params.cardId}`));
          } else {
            next(err);
          }
        });
    })
    .catch((err) => {
      if (err.name === 'TypeError') {
        next(new NOT_FOUND_ERROR(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else {
        next(err);
      }
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res
        .status(STATUS_OK)
        .send(card);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NOT_FOUND_ERROR(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof CastError) {
        next(new BAD_REQUEST_ERROR(`Некорректный _id карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};

module.exports.unputLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => {
      res
        .status(STATUS_OK)
        .send(card);
    })
    .catch((err) => {
      if (err instanceof DocumentNotFoundError) {
        next(new NOT_FOUND_ERROR(`Карточка с _id: ${req.params.cardId} не найдена.`));
      } else if (err instanceof CastError) {
        next(new BAD_REQUEST_ERROR(`Некорректный _id карточки: ${req.params.cardId}`));
      } else {
        next(err);
      }
    });
};
