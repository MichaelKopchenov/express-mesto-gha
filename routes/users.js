const router = require('express').Router();
const {
  createUsers,
  getUserById,
  addUser,
  dataOfUser,
  dataOfUserAvatar,
} = require('../controllers/users');

router.get('/users', createUsers);
router.get('/users/:userId', getUserById);
router.post('/users', addUser);
router.patch('/users/me', dataOfUser);
router.patch('/users/me/avatar', dataOfUserAvatar);

module.exports = router;
