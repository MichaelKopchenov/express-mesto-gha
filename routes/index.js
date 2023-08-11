const router = require('express').Router();
const routerOfUser = require('./users');
const routerOfCards = require('./cards');
const routerOfRegistration = require('./registration');
const routerOfLogin = require('./login');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');

router.use('/signup', routerOfRegistration);
router.use('/signin', routerOfLogin);
router.use(auth);
router.use('/users', routerOfUser);
router.use('/cards', routerOfCards);
router.use('*', (req, res, next) => {
  next(new NotFoundError('страница не найдена.'));
});

module.exports = router;
