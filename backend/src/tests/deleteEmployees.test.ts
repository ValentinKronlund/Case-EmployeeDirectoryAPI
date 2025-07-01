/** @format */

import request from 'supertest';
import app, { server } from '../index';
import { employees } from '../data/seed.mock';
import { Employee } from '../types';

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
