const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello');
});

app.use('/users', usersRouter);

module.exports = app;
