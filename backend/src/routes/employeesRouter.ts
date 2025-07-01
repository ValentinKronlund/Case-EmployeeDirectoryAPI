/** @format */

import express from 'express';
import {
	getAllEmployees,
	searchEmployees,
	addEmployee,
	deleteEmployees,
} from '../data/employeeStore';
import { Employee } from '../types/Employee';
import { checkDuplicateEmail, validateSchema } from './middleware';
import { newEmployeeSchema, deleteIdsSchema, searchQuerySchema } from './schemas';

const router = express.Router();

router.use(express.json());

router.get('/', async (req, res) => {
	const results = await getAllEmployees();
	res.status(200).json({
		message: 'Successfully fetched employee data! ✅',
		data: results,
	});
});

router.post('/search', validateSchema(searchQuerySchema), async (req, res) => {
	const { query } = req.body;
	const results = await searchEmployees(query);
	results.length || results.length !== 0
		? res.json(results)
		: res.status(404).json({ error: 'No employees found with provided argument' });
	return;
});

router.post(
	'/add',
	validateSchema(newEmployeeSchema),
	checkDuplicateEmail,
	async (req, res) => {
		const { newEmployee } = req.body;
		const employeeToAdd: Employee = { ...newEmployee, id: Date.now() };

		await addEmployee(employeeToAdd);

		res.status(201).json({
			message: `Employee ${employeeToAdd.name} created.`,
			data: employeeToAdd,
		});
	},
);

router.delete('/delete', validateSchema(deleteIdsSchema), (req, res) => {
	const { ids } = req.body;

	deleteEmployees(ids);
	res
		.status(200)
		.json({ message: `Users with the following ids have been deleted: ${ids}` });
	return;
});

export default router;
