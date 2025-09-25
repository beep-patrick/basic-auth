const express = require('express');
const Joi = require('joi');
const userStore = require('./userStore');
const router = express.Router();

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
}).required().options({ allowUnknown: false });

router.post('/', async (req, res) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  try {
    await userStore.saveUser(value);
    const newUser = await userStore.getUser(value.username);
    res.json(newUser);
  } catch (err) {
    res.status(500).json({ error: 'Failed to store user.' });
  }
});

module.exports = router;
