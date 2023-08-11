const mongoose = require('mongoose');
const urlValidator = require('../utils/constants');

const { Schema } = mongoose;

const cardSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    minlength: [2, 'Минимальная длина поля - 2'],
    maxlength: [30, 'Максимальная длина поля - 30'],
  },
  link: {
    type: String,
    required: [true, 'Поле должно быть заполнено'],
    validate: {
      validator(v) {
        return urlValidator.test(v);
      },
      message: 'Введите URL',
    },
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'user',
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
