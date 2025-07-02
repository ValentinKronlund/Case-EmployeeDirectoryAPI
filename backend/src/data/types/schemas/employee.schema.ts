/** @format */

import Joi from 'joi';

const nameRegex = /^[\p{L}]+(?:[-\s][\p{L}]+)*$/u;

export const employeeSchema = Joi.object({
	id: Joi.number().min(0).required(),
	name: Joi.string().pattern(nameRegex).required(),
	surname: Joi.string().pattern(nameRegex).required(),
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.lowercase()
		.required(),
});

export const employeeArraySchema = Joi.array()
	.items(employeeSchema)
	.unique('email')
	.min(0)
	.required();
