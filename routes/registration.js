const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');
const urlValidator = require('../utils/constants');

router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(urlValidator),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }).unknown(true),
}), createUser);

module.exports = router;
