const joi = require("joi");
const userjoiSchema = joi.object({
  name: joi.string(),
  email: joi.string().email().required(),
  username: joi.string().alphanum().min(3).max(30),
  password: joi.string().required(),
});

const ProductJoiSchema=joi.object({
  id: joi.string(),
  title: joi.string(),
  image: joi.string(),
  price: joi.number().positive(),
  category: joi.string(),
  description: joi.string(),
});

module.exports = { userjoiSchema,ProductJoiSchema};
