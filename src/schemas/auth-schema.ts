import joi from "@hapi/joi";

export const registerSchema = joi.object({
  name: joi.string().required(),
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  createdAt: joi.date().default(Date.now()),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
});
