const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlValidator = require('../utils/constants');
const {
  login,
  createUser,
  getUsers,
  getUserById,
  dataOfUser,
  editdataOfUser,
  editdataOfUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', dataOfUser);

router.get('/:userId', celebrate({
  params: Joi
    .object()
    .keys({
      userId: Joi
        .string()
        .length(24)
        .hex()
        .required(),
    }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi
    .object()
    .keys({
      name: Joi
        .string()
        .min(2)
        .max(30),
      about: Joi
        .string()
        .min(2)
        .max(30),
    }),
}), editdataOfUser);

router.patch('/me/avatar', celebrate({
  body: Joi
    .object()
    .keys({
      avatar: Joi
        .string()
        .pattern(urlValidator),
    }),
}), editdataOfUserAvatar);

router.post('/signup', celebrate({
  body: Joi
    .object().keys({
      name: Joi
        .string()
        .min(2)
        .max(30),
      about: Joi
        .string()
        .min(2)
        .max(30),
      avatar: Joi
        .string()
        .pattern(urlValidator),
      email: Joi
        .string()
        .required()
        .email(),
      password: Joi
        .string()
        .required()
        .min(3),
    }).unknown(true),
}), createUser);

router.post('/signin', celebrate({
  body: Joi
    .object()
    .keys({
      email: Joi
        .string()
        .required()
        .email(),
      password: Joi
        .string()
        .required()
        .min(3),
    }),
}), login);

module.exports = router;
