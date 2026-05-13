import { celebrate, Joi } from "celebrate";
import { Segments } from "celebrate";

/**
 * Validation schemas for contact-related requests
 * Uses celebrate/Joi for request validation
 */
export const contactValidation = {
  /**
   * Validation for contact creation
   * Requires firstName, lastName, and valid email
   */
  create: celebrate({
    body: Joi.object({
      firstName: Joi.string().required().description("Contact's first name"),
      lastName: Joi.string().required().description("Contact's last name"),
      email: Joi.string().email().required().description("Contact's email address"),
    }),
  }),

  /**
   * Validation for contact updates
   * All fields are optional, but must be valid if provided
   */
  update: celebrate({
    params: Joi.object({
      id: Joi.number().required().description("Contact ID"),
    }),
    body: Joi.object({
      firstName: Joi.string().description("Updated first name"),
      lastName: Joi.string().description("Updated last name"),
      email: Joi.string().email().description("Updated email address"),
    }),
  }),
};

/**
 * Project Validation Schemas
 */
export const projectValidation = {
  create: celebrate({
    [Segments.BODY]: Joi.object({
      name: Joi.string().required().min(1).max(255),
      description: Joi.string().optional().allow('').max(1000),
      status: Joi.string().optional().default('active'),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional(),
    }),
  }),

  update: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      name: Joi.string().optional().min(1).max(255),
      description: Joi.string().optional().allow('').max(1000),
      status: Joi.string().optional(),
      startDate: Joi.date().optional(),
      endDate: Joi.date().optional().allow(null),
    }),
  }),

  byId: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),
};

/**
 * Task Validation Schemas
 */
export const taskValidation = {
  create: celebrate({
    [Segments.BODY]: Joi.object({
      title: Joi.string().required().min(1).max(255),
      description: Joi.string().required().max(1000),
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE').default('TODO'),
      priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'ULTRA').default('MEDIUM'),
      dueDate: Joi.string().optional().allow(null, ''),
      assigneeId: Joi.number().integer().positive().optional().allow(null),
      projectId: Joi.number().integer().positive().optional().allow(null),
    }),
  }),

  update: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      title: Joi.string().optional().min(1).max(255),
      description: Joi.string().optional().allow('').max(1000),
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE').optional(),
      priority: Joi.string().valid('LOW', 'MEDIUM', 'HIGH', 'URGENT', 'ULTRA').optional(),
      dueDate: Joi.date().optional().allow(null),
      assigneeId: Joi.number().integer().positive().optional().allow(null),
      projectId: Joi.number().integer().positive().optional().allow(null),
    }),
  }),

  byId: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
  }),

  updateStatus: celebrate({
    [Segments.PARAMS]: Joi.object({
      id: Joi.number().integer().positive().required(),
    }),
    [Segments.BODY]: Joi.object({
      status: Joi.string().valid('TODO', 'IN_PROGRESS', 'REVIEW', 'DONE').required(),
    }),
  }),
};
