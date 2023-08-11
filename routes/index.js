const router = require('express').Router();
const routerOfUsers = require('./users');
const routerOfCards = require('./cards');
const auth = require('../middlewares/auth');
const routerOfRegistration = require('./registration');
const routerOfLogin = require('./login');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', routerOfRegistration);
router.use('/signin', routerOfLogin);

router.use(auth);

router.use('/users', routerOfUsers);
router.use('/cards', routerOfCards);

router.use('*', (req, res, next) => {
  next(new NotFoundError('страница не найдена.'));
});

module.exports = router;
