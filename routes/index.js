const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NotFoundError('Такая страница не существует.'));
});

module.exports = router;
