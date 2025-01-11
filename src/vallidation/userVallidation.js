const Joi = require('joi');

// Define the Joi validation schema
const createUserVallidation = Joi.object({
  name: Joi.string()
  .pattern(new RegExp('^[a-zA-Z]+( [a-zA-Z]+)*$')) // Allows names with spaces between words
  .min(3)
  .max(30)
  .required()
  .messages({
    'string.pattern.base': 'Name must contain only letters and spaces, and should not start or end with a space.',
  }),
  username: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+$'))
    .min(3)
    .max(30)
    .required(),
  email: Joi.string()
    .email()
    .pattern(new RegExp('^[a-zA-Z0-9@.]+$'))
    .required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    }),
  role: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  dateOfBirth: Joi.date().less('now').required(),
  department: Joi.string().optional(),
  position: Joi.string().optional(),
  hireDate: Joi.date().optional(),
  skills: Joi.array()
  .items(
    Joi.string()
      .pattern(new RegExp('^[a-zA-Z0-9. ]+$')) // Allows letters, numbers, spaces, and a single period
      .min(2)
      .max(100)
  )
  .optional()
  .messages({
    'string.pattern.base': 'Each skill must contain only letters, numbers, spaces, and periods.',
  }),
  certifications: Joi.array()
  .items(
    Joi.object({
      title: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
        .min(2)
        .max(255)
        .required()
        .messages({
          'string.pattern.base': 'Title must only contain letters, numbers, and spaces.',
        }),
      issuedBy: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
        .min(2)
        .max(255)
        .required()
        .messages({
          'string.pattern.base': 'IssuedBy must only contain letters, numbers, and spaces.',
        }),
      date: Joi.date()
        .iso()
        .required()
        .messages({
          'date.format': 'Date must be in the ISO format (YYYY-MM-DD).',
        }),
    })
  )
  .optional(),

  emergencyContact: Joi.object({
    name: Joi.string().required(),
    relationship: Joi.string().required(),
    phone: Joi.string().required(),
  }).optional(),
});


const updateUserValidation = Joi.object({
  name: Joi.string()
    .pattern(new RegExp('^[a-zA-Z]+( [a-zA-Z]+)*$')) // Allows names with spaces between words
    .min(3)
    .max(30)
    .optional()
    .messages({
      'string.pattern.base': 'Name must contain only letters and spaces, and should not start or end with a space.',
    }),
  username: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]+$'))
    .min(3)
    .max(30)
    .optional(),
  email: Joi.string()
    .email()
    .pattern(new RegExp('^[a-zA-Z0-9@.]+$'))
    .optional(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
    .optional()
    .messages({
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
    }),
  role: Joi.string().optional(),
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  dateOfBirth: Joi.date().less('now').optional(),
  department: Joi.string().optional(),
  position: Joi.string().optional(),
  hireDate: Joi.date().optional(),
  skills: Joi.array()
    .items(
      Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9. ]+$')) // Allows letters, numbers, spaces, and a single period
        .min(2)
        .max(100)
    )
    .optional()
    .messages({
      'string.pattern.base': 'Each skill must contain only letters, numbers, spaces, and periods.',
    }),
  certifications: Joi.array()
    .items(
      Joi.object({
        title: Joi.string()
          .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
          .min(2)
          .max(255)
          .optional()
          .messages({
            'string.pattern.base': 'Title must only contain letters, numbers, and spaces.',
          }),
        issuedBy: Joi.string()
          .pattern(new RegExp('^[a-zA-Z0-9 ]+$'))
          .min(2)
          .max(255)
          .optional()
          .messages({
            'string.pattern.base': 'IssuedBy must only contain letters, numbers, and spaces.',
          }),
        date: Joi.date()
          .iso()
          .optional()
          .messages({
            'date.format': 'Date must be in the ISO format (YYYY-MM-DD).',
          }),
      })
    )
    .optional(),
  emergencyContact: Joi.object({
    name: Joi.string().optional(),
    relationship: Joi.string().optional(),
    phone: Joi.string().optional(),
  }).optional(),
});


const createCoomplaintVallidation = Joi.object({
  complaint: Joi.string(),
  email: Joi.string().email().pattern(new RegExp('^[a-zA-Z0-9@.]+$')).required(), // Updated to allow letters, numbers, and @, .
});

// Login Schema
const loginVallidation = Joi.object({
  email: Joi.string()
  .email()
  .pattern(new RegExp('^[a-zA-Z0-9@.]+$'))
  .required(),
password: Joi.string()
  .min(8)
  .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
  .required()
  .messages({
    'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
  }),
});

// Login Schema
const emailVallidation = Joi.object({
    email: Joi.string().email().pattern(new RegExp('^[a-zA-Z0-9@.]+$')).required()// Validates a proper email format
   
});

const passwordResetVallidation = Joi.object({
    token: Joi.string().pattern(new RegExp('^[a-zA-Z0-9 ]+$')).max(1000).required(),
    newPassword: Joi.string().min(8).required().messages({
        'string.min': 'Password must be at least 8 characters long.'
    }) 
});

module.exports = { createUserVallidation, loginVallidation, emailVallidation,passwordResetVallidation,createCoomplaintVallidation};
