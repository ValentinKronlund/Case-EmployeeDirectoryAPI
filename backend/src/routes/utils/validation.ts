/** @format */

import { Employee } from '../../types/Employee';

export function isValidEmployee(
	employee: Partial<Omit<Employee, 'id'>>,
): employee is Omit<Employee, 'id'> {
	return (
		typeof employee.name === 'string' &&
		employee.name.trim() !== '' &&
		typeof employee.surname === 'string' &&
		employee.surname.trim() !== '' &&
		typeof employee.email === 'string' &&
		employee.email.trim() !== ''
	);
}

export function emailAlreadyExists(employees: Employee[], email: string): boolean {
	return employees.some((emp) => emp.email === email);
}

export function isValidIdsArray(ids: Employee['id'][]): boolean {
	return !!ids.length && Array.isArray(ids) && ids.every((id) => typeof id === 'number');
}
