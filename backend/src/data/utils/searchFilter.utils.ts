/** @format */

import { Employee } from '../../types';

export function filterSearchedEmployeesByQuery(employeeData: Employee[], query: string) {
	return employeeData.filter((employee) => {
		return [employee.name, employee.surname, employee.email, employee.id].some(
			(searchField) => searchField.toString().toLowerCase().includes(query.toLowerCase()),
		);
	});
}
