const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  unputLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.delete('/cards/:cardId', deleteCard);
router.post('/cards', createCard);
router.put('/cards/:cardId/likes', putLike);
router.delete('/cards/:cardId/likes', unputLike);

module.exports = router;
