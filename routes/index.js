const router = require('express').Router();
const auth = require('../middlewares/auth');
const NOT_FOUND_ERROR = require('../errors/NotFoundError');
const { createUser, login } = require('../controllers/users');

router.post('/signup', createUser);
router.post('/signin', login);

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use('*', (req, res, next) => {
  next(new NOT_FOUND_ERROR('Такая страница не существует.'));
});

module.exports = router;
