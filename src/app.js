const express = require('express');
const rootRouter = require('./root/controller');
const usersRouter = require('./users/controller');

const app = express();
app.use(express.json());

app.use('/', rootRouter);
app.use('/users', usersRouter);

module.exports = app;
