/** @format */

import express from 'express';
import { getAllEmployees, searchEmployees, addEmployee } from '../data/employeeStore';
import { Employee } from '../types/Employee';
import { emailAlreadyExists, isValidEmployee } from './utils/validation';

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
	const query = req.query.searchArgument as string | undefined;

	if (query) {
		const results = searchEmployees(query);
		results.length
			? res.json(results)
			: res.status(404).json({ error: 'No employees found with provided argument' });
		return;
	}

	res.json(getAllEmployees());
});

router.post('/', (req, res) => {
	const body = req.body;

	if (!body || Object.keys(body).length === 0) {
		res.status(400).json({ error: 'No employee data sent in request body' });
		return;
	}

	const newEmployee: Omit<Employee, 'id'> = body.newEmployee;
	const existingEmployees = getAllEmployees();

	if (!isValidEmployee(newEmployee)) {
		res.status(400).json({ error: 'You must provide valid employee data' });
		return;
	}

	if (emailAlreadyExists(existingEmployees, newEmployee.email)) {
		res.status(400).json({ error: 'Employee already exists with the provided email' });
		return;
	}

	const employeeToAdd = { ...newEmployee, id: Date.now() };
	addEmployee(employeeToAdd);

	res.status(201).json({
		message: `Employee ${newEmployee.name} created, with email ${newEmployee.email}`,
	});
	return;
});

export default router;
