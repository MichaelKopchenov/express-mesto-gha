const express = require('express');
const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такая страница не существует.'));
});

router.use(express.json());

module.exports = router;
