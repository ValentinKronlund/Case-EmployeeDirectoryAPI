/** @format */

// src/routes/middleware/checkDuplicateEmail.middleware.ts

import { Response, NextFunction } from 'express';
import { getAllEmployees } from '../../data/employeeStore';
import { NewEmployeeRequest } from '../../types';

export async function checkDuplicateEmail(
	req: NewEmployeeRequest,
	res: Response,
	next: NextFunction,
) {
	const { newEmployee } = req.body;

	if (!newEmployee?.email) {
		res.status(400).json({ error: 'Email is required to perform duplication check.' });
		return;
	}

	try {
		const existingEmployees = await getAllEmployees();

		const emailExists = existingEmployees.some(
			(employee) => employee.email.toLowerCase() === newEmployee.email.toLowerCase(),
		);

		if (emailExists) {
			res.status(409).json({ error: 'An employee with this email already exists.' });
			return;
		}

		next();
	} catch (err) {
		console.error('❌ Error checking for duplicate email:', err);
		res.status(500).json({ error: 'Internal Server Error' });
	}

	return;
}
