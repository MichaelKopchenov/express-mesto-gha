const router = require('express').Router();
const {
  getUsers,
  getUserById,
  dataOfUser,
  editdataOfUser,
  editdataOfUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserById);
router.post('/', dataOfUser);
router.patch('/me', editdataOfUser);
router.patch('/me/avatar', editdataOfUserAvatar);

module.exports = router;
