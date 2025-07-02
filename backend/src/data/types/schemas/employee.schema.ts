/** @format */

import Joi from 'joi';

export const employeeSchema = Joi.object({
	id: Joi.number().min(0).required(),
	name: Joi.string().required(),
	surname: Joi.string().required(),
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
