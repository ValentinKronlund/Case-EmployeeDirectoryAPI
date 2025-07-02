/** @format */

import request from 'supertest';
import app from '../index';
import { employeesSeed } from '../data/seed.mock';

describe('GET /api/employees', () => {
	describe('| No search query arguments passed:', () => {
		it('| test should return all employees', async () => {
			const res = await request(app).get('/api/employees');
			const successStringMatch = 'Successfully fetched employee data';

			expect(res.statusCode).toEqual(200);
			expect(res.body.message).toMatch(successStringMatch);
			expect(res.body.error).toEqual(undefined);
			expect(res.body).toHaveProperty('data', employeesSeed);
		});
	});
});

describe('POST /api/employees/search', () => {
	describe('| Search argument "Alice" passed:', () => {
		it('| test should return the employee "Alice"', async () => {
			const query = { query: 'Alice' };
			const res = await request(app).post('/api/employees/search').send(query);

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
		it('| test should return employees with "1" in any of their data', async () => {
			const query = { query: '1' };
			const res = await request(app).post('/api/employees/search').send(query);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([
				{ id: 0, name: 'Nole', surname: 'Nullish', email: '0x00@not1.com' },
				{
					id: 1,
					name: 'Alice',
					surname: 'Alexandersson',
					email: 'alice.alex@nomail.com',
				},
				{ id: 10, name: 'Jake', surname: 'Josephs', email: 'jj.adams@nomail.com' },
			]);
		});
	});

	describe('| Search argument "ErViNg" passed:', () => {
		it('| test should return the employee "Eric Erving"', async () => {
			const query = { query: 'ErViNg' };
			const res = await request(app).post('/api/employees/search').send(query);

			expect(res.statusCode).toEqual(200);
			expect(res.body).toEqual([
				{ id: 5, name: 'Eric', surname: 'Erving', email: 'eric@nomail.com' },
			]);
		});
	});

	describe('| Search argument "Alexandersson Erving" passed:', () => {
		it('| test should throw a Not Found (404) error', async () => {
			const query = { query: 'Alexandersson Erving' };
			const res = await request(app).post('/api/employees/search').send(query);

			expect(res.statusCode).toEqual(404);
			expect(res.body.error).toEqual('No employees found with provided argument');
		});
	});
});

describe('POST /api/employees/add', () => {
	describe('| Passing valid employee object', () => {
		it('| test should accept object with valid data', async () => {
			const employee = {
				newEmployee: {
					name: 'Foo',
					surname: 'Bar',
					email: 'fubar@example.com',
				},
			};

			const successString = `Employee ${employee.newEmployee.name} created`;

			const result = await request(app).post('/api/employees/add').send(employee);

			expect(result.status).toEqual(201);
			expect(result.body.message).toMatch(successString);
			expect(result.body.error).toEqual(undefined);
		});
	});

	describe('| Passing an empty object in the body', () => {
		it('| test should reject invalid employee data', async () => {
			const res = await request(app).post('/api/employees/add').send({});

			expect(res.status).toEqual(400);
			expect(res.body).toHaveProperty('error');
		});
	});

	describe('| Passing employee objects with invalid "role" property', () => {
		it('| test should reject objects with invalid data', async () => {
			const employee = {
				newEmployee: {
					name: 'John',
					surname: 'Doe',
					email: 'JD@example.com',
					role: 'UX Designer',
				},
			};
			const errorStringMatch = '"newEmployee.role" is not allowed';

			const result = await request(app).post('/api/employees/add').send(employee);

			expect(result.status).toEqual(400);
			expect(result.body.error).toMatch(errorStringMatch);
		});
	});

	describe('| Passing employee objects with empty "name" property', () => {
		it('| test should reject objects with invalid data', async () => {
			const employee = {
				newEmployee: {
					name: '',
					surname: 'Doe',
					email: 'ghost_doe@example.com',
				},
			};
			const successStringMatch =
				'Name cannot be empty, instead it must be at least 2 characters long.';

			const result = await request(app).post('/api/employees/add').send(employee);

			expect(result.status).toEqual(400);
			expect(result.body.error).toMatch(successStringMatch);
		});
	});

	describe('| Passing employee objects with empty "surname" property', () => {
		it('| test should reject objects with invalid data', async () => {
			const employee = {
				newEmployee: {
					name: 'John',
					surname: '',
					email: 'ghost_John@example.com',
				},
			};
			const successStringMatch =
				'Surname cannot be empty, instead it must be at least 2 characters long.';

			const result = await request(app).post('/api/employees/add').send(employee);

			expect(result.status).toEqual(400);
			expect(result.body.error).toMatch(successStringMatch);
		});
	});

	describe('| Passing employee objects with empty "email" property', () => {
		it('| test should reject objects with invalid data', async () => {
			const employee = {
				newEmployee: {
					name: 'John',
					surname: 'Doe',
					email: '',
				},
			};
			const errorStringMatch = 'Email cannot be empty';

			const result = await request(app).post('/api/employees/add').send(employee);

			expect(result.status).toEqual(400);
			expect(result.body.error).toMatch(errorStringMatch);
		});
	});

	describe('| Passing employee objects with invalid "email" property', () => {
		it('| test should reject objects with invalid data', async () => {
			const employee = {
				newEmployee: {
					name: 'John',
					surname: 'Doe',
					email: 'John_Doe',
				},
			};

			const result = await request(app).post('/api/employees/add').send(employee);

			expect(result.status).toEqual(400);
			expect(result.body.error).toMatch(/must be a valid email/i);
		});
	});

	describe('| Passing employee objects with duplicated emails', () => {
		it('| test should reject objects with duplicated email data', async () => {
			const employee_one = {
				newEmployee: {
					name: 'John',
					surname: 'Doe',
					email: 'JD@gmail.com',
				},
			};

			const employee_two = {
				newEmployee: {
					name: 'Jane',
					surname: 'Doe',
					email: 'JD@gmail.com',
				},
			};

			const result_one = await request(app).post('/api/employees/add').send(employee_one);
			const result_two = await request(app).post('/api/employees/add').send(employee_two);

			expect(result_one.status).toEqual(201);
			expect(result_two.status).toEqual(409);
			expect(result_two.body.error).toMatch(/already exists/i);
		});
	});

	describe('| Passing employee objects with duplicated names and surnames, but unique emails', () => {
		it('| test should accept objects with duplicated name data', async () => {
			const employee_one = {
				newEmployee: {
					name: 'John',
					surname: 'Doe',
					email: 'John_D@example.com',
				},
			};

			const employee_two = {
				newEmployee: {
					name: 'Jane',
					surname: 'Doe',
					email: 'Jane_D@example.com',
				},
			};

			const result_one = await request(app).post('/api/employees/add').send(employee_one);
			const result_two = await request(app).post('/api/employees/add').send(employee_two);

			expect(result_one.status).toEqual(201);
			expect(result_two.status).toEqual(201);
			expect(result_one.body.message).toMatch(
				`Employee ${employee_one.newEmployee.name} created`,
			);
			expect(result_two.body.message).toMatch(
				`Employee ${employee_two.newEmployee.name} created`,
			);
			expect(result_one.body.error).toEqual(undefined);
			expect(result_two.body.error).toEqual(undefined);
		});
	});

	describe('| Passing employee objects with an ID property', () => {
		it('| test should accept objects with ID property, but not use it when creating new user.', async () => {
			const employee = {
				newEmployee: {
					id: 666,
					name: 'Lucifer',
					surname: 'Morningstar',
					email: 'good_guy@example.com',
				},
			};

			const successString = `Employee ${employee.newEmployee.name} created`;

			const result = await request(app).post('/api/employees/add').send(employee);

			expect(result.status).toEqual(201);
			expect(result.body.message).toMatch(successString);
			expect(result.body.error).toEqual(undefined);
		});
	});
});
