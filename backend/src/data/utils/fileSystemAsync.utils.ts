/** @format */

import fs from 'fs/promises';
import path from 'path';
import { Employee } from '../../types';
import { employeeArraySchema } from '../types/schemas/employee.schema';
import { employeesSeed } from '../seed.mock';

const DB_PATH = path.join(__dirname, '../employeeLocalStorage/employees.json');

export async function readEmployeesFiles(): Promise<Employee[]> {
	const data = await fs.readFile(DB_PATH, 'utf-8');
	const parsedData = JSON.parse(data);

	const { error, value } = employeeArraySchema.validate(parsedData);
	if (error) throw new Error('Invalid employee data in file');
	return value;
}

export async function writeEmployeesFile(employees: Employee[]): Promise<void> {
	await fs.writeFile(DB_PATH, JSON.stringify(employees, null, 2));
}

export async function seedDatabase() {
	await writeEmployeesFile(employeesSeed);
}
