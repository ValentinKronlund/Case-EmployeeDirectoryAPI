/** @format */

import request from 'supertest';
import app, { server } from '../index';
import { employees } from '../data/mockDb';
import { Employee } from '../types/Employee';

describe('GET /api/employees', () => {
	describe('| No search query arguments passed:', () => {
		it('should return all employees', async () => {
			const res = await request(app).get('/api/employees');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([...employees]);
		});
	});

	describe('| Search argument "Alice" passed:', () => {
		it('should return the employee "Alice"', async () => {
			const res = await request(app).get('/api/employees?searchArgument=Alice');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([
				{
					id: 1,
					name: 'Alice',
					surname: 'Alexandersson',
					email: 'alice.alex@nomail.com',
				},
			]);
		});
	});

	describe('| Search argument "1" passed: ', () => {
		it('should return employees with "1" in any of their data', async () => {
			const res = await request(app).get('/api/employees?searchArgument=1');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([
				{ id: 0, name: 'Nole', surname: 'Nullish', email: '0x00@not1.com' },
				{
					id: 1,
					name: 'Alice',
					surname: 'Alexandersson',
					email: 'alice.alex@nomail.com',
				},
				{ id: 10, name: 'Jake', surname: 'Josephs', email: 'JJ.Adams@nomail.com' },
			]);
		});
	});

	describe('| Search argument "ErViNg" passed:', () => {
		it('should return the employee "Eric Erving"', async () => {
			const res = await request(app).get('/api/employees?searchArgument=ErViNg');
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([
				{ id: 5, name: 'Eric', surname: 'Erving', email: 'Eric@nomail.com' },
			]);
		});
	});

	describe('| Search argument "Alexandersson Erving" passed:', () => {
		it('should throw a Not Found (404) error', async () => {
			const res = await request(app).get(
				'/api/employees?searchArgument=Alexandersson%20Erving',
			);
			expect(res.statusCode).toEqual(404);
			expect(res.body).toEqual({ error: 'No employees found with provided argument' });
		});
	});
});

describe('POST /api/employees', () => {
	describe('| Passing an employee object in request body', () => {
		describe('| Passing a full valid employee object in body', () => {
			it('should return a "201" status code, and success message', async () => {
				const newEmployee: Employee = {
					id: 11,
					name: 'Eleven',
					surname: 'Strange',
					email: 'Stranger_Things@nomail.com',
				};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(201);
				expect(res.body).toEqual({
					message: `Employee ${newEmployee.name} created, with email ${newEmployee.email}`,
				});
			});
		});

		describe('| Passing an object that lacks an "id" in body', () => {
			it('should return a "201" status code, and success message', async () => {
				const newEmployee: Omit<Employee, 'id'> = {
					name: 'Mike',
					surname: 'Strange',
					email: 'Stranger_Mike@nomail.com',
				};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(201);
				expect(res.body).toEqual({
					message: `Employee ${newEmployee.name} created, with email ${newEmployee.email}`,
				});
			});
		});

		describe('| Passing an object that lacks a name in body', () => {
			it('should throw a "400" Bad Request error', async () => {
				const newEmployee: Employee = {
					id: 11,
					name: '',
					surname: 'Strange',
					email: 'Stranger_Things@nomail.com',
				};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(400);
				expect(res.body).toEqual({ error: 'You must provide valid employee data' });
			});
		});

		describe('| Passing an object that lacks a surname in body', () => {
			it('should throw a "400" Bad Request error', async () => {
				const newEmployee: Employee = {
					id: 11,
					name: 'Eleven',
					surname: '',
					email: 'Stranger_Things@nomail.com',
				};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(400);
				expect(res.body).toEqual({ error: 'You must provide valid employee data' });
			});
		});

		describe('| Passing an object that lacks an email in body', () => {
			it('should throw a "400" Bad Request error', async () => {
				const newEmployee: Employee = {
					id: 11,
					name: 'Eleven',
					surname: 'Strange',
					email: '',
				};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(400);
				expect(res.body).toEqual({ error: 'You must provide valid employee data' });
			});
		});

		describe('| Passing an object with an already existing email in body', () => {
			it('should throw a "400" Bad Request error', async () => {
				const newEmployee: Employee = {
					id: 11,
					name: 'Eleven',
					surname: 'Strange',
					email: 'Stranger_Things@nomail.com',
				};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(400);
				expect(res.body).toEqual({
					error: 'Employee already exists with the provided email',
				});
			});
		});

		describe('| Passing an object with an already existing name, but unique email in body', () => {
			it('should return a "201" Success status code, and success message', async () => {
				const newEmployee: Employee = {
					id: 11,
					name: 'Eleven',
					surname: 'Strange',
					email: 'Things_are_strange@nomail.com',
				};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(201);
				expect(res.body).toEqual({
					message: `Employee ${newEmployee.name} created, with email ${newEmployee.email}`,
				});
			});
		});
	});

	describe('| Passing NO employee object in request body', () => {
		describe('| Passing an empty object in body', () => {
			it('should throw a "400" Bad Request error', async () => {
				const newEmployee = {};
				const res = await request(app).post('/api/employees').send(newEmployee);
				expect(res.statusCode).toEqual(400);
				expect(res.body).toEqual({ error: 'No employee data sent in request body' });
			});
		});

		describe('| Passing an empty {newEmployee} object in body', () => {
			it('should throw a "400" Bad Request error', async () => {
				const newEmployee = {};
				const res = await request(app).post('/api/employees').send({ newEmployee });
				expect(res.statusCode).toEqual(400);
				expect(res.body).toEqual({ error: 'You must provide valid employee data' });
			});
		});

		describe('| Not passing anything in body', () => {
			it('should throw a "400" Bad Request error', async () => {
				const res = await request(app).post('/api/employees').send();
				expect(res.statusCode).toEqual(400);
				expect(res.body).toEqual({ error: 'No employee data sent in request body' });
			});
		});
	});
});

describe('POST /api/deleteEmployees', () => {
	describe('| Passing a single employees "id" as a STRING OUTSIDE of a query', () => {
		it('should throw a "400" Bad Request error, with a failing message', async () => {
			const ids = '1';
			const res = await request(app).post('/api/deleteEmployees').send(ids);
			expect(res.statusCode).toEqual(400);
			expect(res.body).toEqual({ error: 'No employee ids have been sent in the query' });
		});
	});

	describe('| Passing a single employees "id" as a STRING', () => {
		it('should throw a "400" Bad Request error, with a failing message', async () => {
			const query = '1';
			const res = await request(app).post('/api/deleteEmployees').send({ query });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toEqual({
				error: 'Invalid ids have been provided. Aborting deletion request',
			});
		});
	});

	describe('| Passing a single employees "id" as a NUMBER', () => {
		it('should throw a "400" Bad Request error, with a failing message', async () => {
			const query = 1;
			const res = await request(app).post('/api/deleteEmployees').send({ query });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toEqual({
				error: 'Invalid ids have been provided. Aborting deletion request',
			});
		});
	});

	describe('| Passing a single employees "id" as a NUMBER inside of an array', () => {
		it('should return a "200" Success code, with a success message', async () => {
			const query = [1];
			const res = await request(app).post('/api/deleteEmployees').send({ query });
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual({
				message: `Users with the following ids have been deleted: ${query}`,
			});
		});
	});

	describe('| Passing a single employees "id" as a STRING inside of an array', () => {
		it('should throw a "400" Bad Request error, with a failing message', async () => {
			const query = ['1'];
			const res = await request(app).post('/api/deleteEmployees').send({ query });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toEqual({
				error: 'Invalid ids have been provided. Aborting deletion request',
			});
		});
	});

	describe('| Passing multiple employees "id" as NUMBERS inside of an array', () => {
		const query = [2, 3, 4, 5];

		it('| should return a "200" Success code, with a success message', async () => {
			const res = await request(app).post('/api/deleteEmployees').send({ query });
			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual({
				message: `Users with the following ids have been deleted: ${query}`,
			});
		});

		it('| should not expect deleted employees to remain in the database', async () => {
			const { body: remainingEmployeesResult } = await request(app).get('/api/employees');
			const matchedEmployeeWithDeleted = remainingEmployeesResult.filter(
				(employee: Employee) => query.includes(employee.id),
			);

			expect(matchedEmployeeWithDeleted).toEqual([]);
		});
	});

	describe('| Passing multiple employees "id" as mixed types inside of an array', () => {
		it('should throw a "400" Bad Request error, with failing message', async () => {
			const query = [2, '3', { '4': 4 }, [5]];
			const res = await request(app).post('/api/deleteEmployees').send({ query });
			expect(res.statusCode).toEqual(400);
			expect(res.body).toEqual({
				error: 'Invalid ids have been provided. Aborting deletion request',
			});
		});
	});
});

afterAll((done) => {
	server.close(done);
});
