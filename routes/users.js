const router = require('express').Router();
const {
  createUser,
  getUserById,
  getUsers,
  dataOfUser,
  dataOfUserAvatar,
} = require('../controllers/users');

router.get('/', createUser);
router.get('/:userId', getUserById);
router.post('/', getUsers);
router.patch('/me', dataOfUser);
router.patch('/me/avatar', dataOfUserAvatar);

module.exports = router;
