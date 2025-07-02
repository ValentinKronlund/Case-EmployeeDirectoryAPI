/** @format */
import { Employee } from '../types';
import { readEmployeesFiles, writeEmployeesFile } from './utils';

export async function getAllEmployees(): Promise<Employee[]> {
	try {
		return await readEmployeesFiles();
	} catch (error) {
		if (process.env.NODE_ENV !== 'test') {
			console.error('Failed to read "employees.json"', error);
		}
		return [];
	}
}

export async function searchEmployees(query: string): Promise<Employee[]> {
	const employeeData = await getAllEmployees();
	const filteredData = employeeData.filter((employee) => {
		return [employee.name, employee.surname, employee.email, employee.id].some(
			(searchField) => searchField.toString().toLowerCase().includes(query.toLowerCase()),
		);
	});

	return filteredData;
}

export async function addEmployee(employee: Employee) {
	const employeeData = await getAllEmployees();
	const newEmployeeData = [...employeeData, employee];
	writeEmployeesFile(newEmployeeData);
}

export async function deleteEmployees(ids: number[]) {
	const employeeData = await getAllEmployees();
	const newEmployeeData = employeeData.filter((employee) => !ids.includes(employee.id));
	writeEmployeesFile(newEmployeeData);
}
