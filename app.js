const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const IternalServerError = require('./errors/IternalServerError');

const { PORT = 3000, DATABASE = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(helmet());

mongoose.connect(DATABASE);

app.use('/', require('./routes/index'));

app.use(errors());

app.use(IternalServerError);

app.listen(PORT);
