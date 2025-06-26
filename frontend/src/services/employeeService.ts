/** @format */

import axios from 'axios';
import { Employee } from '../types/Employee';

const API_URL = process.env.REACT_APP_API_URL;

export function fetchAllEmployees(): Promise<Employee[]> {
	return axios.get(`${API_URL}/api/employees`).then((res) => res.data);
}

export function searchEmployees(query: String): Promise<Employee[]> {
	return axios
		.get(`${API_URL}/api/employees?searchArgument=${query}`)
		.then((res) => res.data);
}

export function createEmployee(newEmployee: Omit<Employee, 'id'>) {
	return axios.post(`${API_URL}/api/employees`, { newEmployee });
}

export function deleteEmployees(query: readonly Employee['id'][]) {
	return axios.post(`${API_URL}/api/deleteEmployees`, { query });
}
