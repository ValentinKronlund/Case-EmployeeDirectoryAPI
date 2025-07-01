/** @format */

import Joi from 'joi';

export const newEmployeeSchema = Joi.object({
	newEmployee: Joi.object({
		name: Joi.string().required(),
		surname: Joi.string().required(),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
	}).required(),
});

export const deleteIdsSchema = Joi.object({
	ids: Joi.array().items(Joi.number().integer().min(0).required()),
});

export const searchQuerySchema = Joi.object({
	query: Joi.string(),
});
