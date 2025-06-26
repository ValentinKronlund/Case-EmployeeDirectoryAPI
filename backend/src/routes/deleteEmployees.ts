/** @format */

import express from 'express';
import { deleteEmployees } from '../data/employeeStore';
import { isValidIdsArray } from './utils/validation';

const router = express.Router();

router.use(express.json());

router.post('/', (_req, res) => {
	const body = _req.body;

	if (!body || Object.keys(body).length === 0 || !body.query) {
		res.status(400).json({ error: 'No employee ids have been sent in the query' });
		return;
	}

	const { query: ids } = body;
	if (isValidIdsArray(ids)) {
		deleteEmployees(ids);
		res
			.status(200)
			.json({ message: `Users with the following ids have been deleted: ${ids}` });
		return;
	}

	res
		.status(400)
		.json({ error: 'Invalid ids have been provided. Aborting deletion request' });

	return;
});

export default router;
