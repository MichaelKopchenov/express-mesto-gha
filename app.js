const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { errors } = require('celebrate');
const internalServerError = require('./errors/InternalServerError');
const router = require('./routes');
const auth = require('./middlewares/auth');

const { PORT = 3000, DATABASE = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const { createUsers, login } = require('./controllers/users');

const app = express();
app.use(bodyParser.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.post('/signin', login);
app.post('/signup', createUsers);

app.use(auth);
app.use(router);

app.use(limiter);

app.use(helmet());

mongoose.connect(DATABASE);

app.use(errors());

app.use(internalServerError);

app.listen(PORT);
