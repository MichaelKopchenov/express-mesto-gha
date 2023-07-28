const router = require('express').Router();
const {
  createUser,
  getUserById,
  getUsers,
  dataOfUser,
  dataOfUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', createUser);
router.patch('/me', dataOfUser);
router.patch('/me/avatar', dataOfUserAvatar);

module.exports = router;
