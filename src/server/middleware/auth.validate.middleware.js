import { celebrate, Joi, Segments } from "celebrate";

/**
 * Email regex pattern (RFC 5322 simplified)
 */
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Password pattern: at least 6 chars
 * Simple pattern for easier UX
 */
const passwordPattern = /^.{6,}$/;

export const validateRegister = celebrate({
  [Segments.BODY]: Joi.object({
    name: Joi.string().required().min(2).max(255).trim(),
    email: Joi.string()
      .required()
      .email()
      .lowercase()
      .trim(),
    password: Joi.string()
      .required()
      .min(6)
      .regex(passwordPattern)
      .messages({
        'string.pattern.base': 'Mật khẩu phải có ít nhất 6 ký tự',
      }),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .messages({
        'any.only': 'Mật khẩu xác nhận không khớp',
      }),
  }).required(),
});

export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string()
      .required()
      .email()
      .lowercase()
      .trim(),
    password: Joi.string().required(),
  }).required(),
});