const express = require('express');
const Joi = require('joi');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello');
});

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
}).required().options({ allowUnknown: false });

app.post('/users', (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  res.json(value);
});

module.exports = app;
