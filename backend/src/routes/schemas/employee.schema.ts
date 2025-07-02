/** @format */

import Joi from 'joi';

export const newEmployeeSchema = Joi.object({
	newEmployee: Joi.object({
		id: Joi.number().optional(),
		name: Joi.string().min(2).required().messages({
			'string.base': 'Name must be a string',
			'string.min': 'Name must be at least 2 characters long',
			'string.empty':
				'Name cannot be empty, instead it must be at least 2 characters long.',
			'any.required': 'Name is required',
		}),
		surname: Joi.string().min(2).required().messages({
			'string.base': 'Surname must be a string',
			'string.min': 'Surname must be at least 2 characters long',
			'string.empty':
				'Surname cannot be empty, instead it must be at least 2 characters long.',
			'any.required': 'Surname is required',
		}),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.lowercase()
			.required()
			.messages({
				'string.base': 'Email must be a string',
				'string.email': 'Email must be a valid email address',
				'string.empty': 'Email cannot be empty',
				'any.required': 'Email is required',
			}),
	})
		.required()
		.messages({
			'object.base': 'newEmployee must be an object',
			'any.required': 'newEmployee object is required',
		}),
});

const employeeIdSchema = Joi.number().integer().min(0).required().messages({
	'number.base': 'ID must be a number',
	'number.integer': 'ID must be an integer',
	'number.min': 'ID must be greater than or equal to 0',
	'any.required': 'Each employee ID is required',
});

export const deleteIdsSchema = Joi.object({
	ids: Joi.array().items(employeeIdSchema).required().messages({
		'array.base':
			'IDs field is required, and must be passed inside an object with the key of ids, and with an array value of numbers.',
		'array.includes':
			'Each item in the array must be a valid employee ID object of type integer',
		'any.required':
			'IDs field is required, and must be passed inside an object with the key of ids, and with an array value of numbers.',
	}),
});

export const searchQuerySchema = Joi.object({
	query: Joi.string(),
});
