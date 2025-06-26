/** @format */

import { LocalStorage } from 'node-localstorage';
import path from 'path';
import { Employee } from '../types/Employee';
import { employees } from './mockDb';

const localStoragePath = path.resolve(__dirname, 'employeeLocalStorage');
const localStorage = new LocalStorage(localStoragePath);

function initStorage() {
	if (!localStorage.getItem('employees')) {
		seedEmployees();
	}
}

export function seedEmployees() {
	localStorage.clear();
	localStorage.setItem('employees', JSON.stringify(employees));
}

export function getAllEmployees(): Employee[] {
	initStorage();
	return JSON.parse(localStorage.getItem('employees') || '[]');
}

export function searchEmployees(query: string): Employee[] {
	return getAllEmployees().filter((employee) => {
		return [employee.name, employee.surname, employee.email, employee.id].some(
			(searchField) => searchField.toString().toLowerCase().includes(query.toLowerCase()),
		);
	});
}

export function addEmployee(employee: Employee) {
	const employees = getAllEmployees();
	employees.push(employee);
	localStorage.setItem('employees', JSON.stringify(employees));
}

export function deleteEmployees(ids: number[]) {
	const employees = getAllEmployees().filter((employee) => !ids.includes(employee.id));
	localStorage.setItem('employees', JSON.stringify(employees));
}
