const Joi = require('joi');


const signupSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'customer').required()
});


const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});


const brandSchema = Joi.object({
  name: Joi.string().max(50).required(),
  year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  is_exists: Joi.string().valid('YES', 'NO').required(),
  country: Joi.string().max(100).required(),
  vehicles: Joi.array().items(
    Joi.object({
      id: Joi.number().optional(),     
      name: Joi.string().required(),
      color: Joi.array().items(Joi.string()).required(),
      price: Joi.number().precision(2).required()
    })
  ).required()
});

module.exports = { signupSchema, loginSchema, brandSchema };
