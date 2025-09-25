const express = require('express');
const Joi = require('joi');
const userStore = require('./userStore');
const router = express.Router();

const userSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
}).required().options({ allowUnknown: false });

router.post('/', async (req, res) => {
  let { error, value } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  ({ error, newUser } = await userStore.saveUser(value.username, value.password));
  if (error) {
    return res.status(400).json({ error });
  }
  res.json(newUser);  
});

module.exports = router;
