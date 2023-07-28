const router = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  putLike,
  unputLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', deleteCard);
router.post('/', createCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', unputLike);

module.exports = router;
