/** @format */
import axios from 'axios';
import { Employee } from '../types/Employee';
import { APIWrapperOptions } from '../types/interface';
import { buildRequestWrapper } from '../utils/wrappers/apiRequestWrapper';

export function fetchAllEmployees(): Promise<Employee[]> {
	return axios.get(`/employees`).then((res) => res.data);
}

export function searchEmployees(query: String): Promise<Employee[]> {
	return axios.get(`/employees?searchArgument=${query}`).then((res) => res.data);
}

export function createEmployee(newEmployee: Omit<Employee, 'id'>) {
	const options: APIWrapperOptions = {
		url: '/employees/add',
		method: 'POST',
		body: { newEmployee },
		buildError: {
			message: `Failed to add new employee ${newEmployee.name} ${newEmployee.surname}, ${newEmployee.email} 🦧`,
		},
	};
	return axios.post(`/employees`, { newEmployee });
}

export async function deleteEmployee(ids: Employee['id'][]) {
	const options: APIWrapperOptions = {
		url: `/employees/delete`,
		method: 'DELETE',
		body: { ids },
		buildError: { message: 'Failed to delete employee(s) 🦧' },
	};
	return buildRequestWrapper(options);
}
