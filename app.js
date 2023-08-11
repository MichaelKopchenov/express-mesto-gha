const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const InternalServerError = require('./errors/IternalServerError');
const { createUsers, login } = require('./controllers/users');

const { PORT = 3000, DATABASE = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.post('/signin', login);
app.post('/signup', createUsers);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DATABASE);

app.use('/', require('./routes/index'));

app.use(errors());

app.use(InternalServerError);

app.listen(PORT);
