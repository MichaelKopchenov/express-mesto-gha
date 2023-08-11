const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('страница не найдена.'));
});

module.exports = router;
