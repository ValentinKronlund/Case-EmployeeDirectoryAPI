/** @format */

import { promises as fs } from 'fs';
import path from 'path';
import { Employee } from '../../types';
import { employeeArraySchema } from '../types/schemas/employee.schema';
import { employeesSeed } from '../seed.mock';

const DB_PATH = path.join(__dirname, '../employeeLocalStorage/employees.json');

export async function readEmployeesFiles(): Promise<Employee[]> {
	const data = await fs.readFile(DB_PATH, 'utf-8');
	const parsedData: Employee[] = JSON.parse(data);

	const { error, value } = employeeArraySchema.validate(parsedData);
	if (error) {
		console.error('INVALID DATA: ', value);
		throw new Error('Invalid employee data in file');
	}
	return value;
}

export async function writeEmployeesFile(employees: Employee[]): Promise<void> {
	try {
		await fs.writeFile(DB_PATH, JSON.stringify(employees, null, 2));
	} catch (error) {
		console.error(error);
		throw new Error(
			'An unkown error has occured when attempting to execute "writeEmployeesFile"',
		);
	}
}

async function clearDatabase(): Promise<void> {
	await fs.rm(DB_PATH, { force: true });
}

export async function seedDatabase(): Promise<void> {
	try {
		await clearDatabase();
		await writeEmployeesFile(employeesSeed);
		console.log('🌱 Database seeded successfully!');
	} catch (error) {
		console.error('🪾 Failed to seed database', error);
		throw new Error('Seeding failed. Aborting');
	}
}
