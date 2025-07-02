/** @format */

import { Request, Response, NextFunction } from 'express';
import { readEmployeesFiles } from '../../data/utils';

export async function checkDatabaseHealth(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	try {
		await readEmployeesFiles();
		next();
	} catch (error) {
		if (process.env.NODE_ENV !== 'test') {
			console.error(
				'🚨 Database health check failed -- Something seems to be wrong with the local database',
				error,
			);
			res.status(500).json({
				error: 'Internal Server Error',
				message: 'There is currently a problem retrieving data from the database.',
			});
		} else {
			next();
		}
	}
}
