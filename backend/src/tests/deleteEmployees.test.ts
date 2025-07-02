/** @format */
import request from 'supertest';
import app from '../index';
import { Employee } from '../types';

describe('POST /api/employees/delete', () => {
	describe('| Passing a single employees "id" as a STRING', () => {
		it('should throw a "400" Bad Request error, with a failing message', async () => {
			const ids = '1';
			const res = await request(app).delete('/api/employees/delete').send(ids);
			expect(res.statusCode).toEqual(500);
		});
	});

	describe('| Passing a single employees "id" as a STRING inside of an object with a key of "ids"', () => {
		it('should throw a "400" Bad Request error, with a failing message', async () => {
			const query = { ids: '1' };
			const res = await request(app).delete('/api/employees/delete').send(query);
			const errorStringMatch =
				'IDs field is required, and must be passed inside an object with the key of ids, and with an array value of numbers.';

			expect(res.statusCode).toEqual(400);
			expect(res.body.error).toEqual(errorStringMatch);
		});
	});

	describe('| Passing a single employees "id" as a NUMBER inside of an object with a key of "ids"', () => {
		it('should throw a "400" Bad Request error, with a failing message', async () => {
			const query = { ids: 1 };
			const res = await request(app).delete('/api/employees/delete').send(query);
			const errorStringMatch =
				'IDs field is required, and must be passed inside an object with the key of ids, and with an array value of numbers.';
			expect(res.statusCode).toEqual(400);
			expect(res.body.error).toEqual(errorStringMatch);
		});
	});

	describe('| Passing a single employees "id" as an object, with a key of "ids" and an array of NUMBER as a value', () => {
		it('should return a "200" Success code, with a success message', async () => {
			const query = { ids: [1] };
			const res = await request(app).delete('/api/employees/delete').send(query);

			const successStringMatch = 'Users with the following ids have been deleted: 1';
			expect(res.statusCode).toEqual(200);
			expect(res.body.message).toEqual(successStringMatch);
		});
	});

	describe('| Passing a single employees "id" as an object, with a key of "ids" and an array of STRING as a value', () => {
		it('should throw a "200" Success code, with a success message', async () => {
			const query = { ids: ['2'] };
			const res = await request(app).delete('/api/employees/delete').send(query);
			const successStringMatch = `Users with the following ids have been deleted: ${query.ids[0]}`;
			expect(res.statusCode).toEqual(200);
			expect(res.body.message).toEqual(successStringMatch);
		});
	});

	describe('| Passing a multiple employees "id" as an object, with a key of "ids" and an array of NUMBER as a value', () => {
		const query = { ids: [2, 3, 4, 5] };
		it('| should return a "200" Success code, with a success message', async () => {
			const res = await request(app).delete('/api/employees/delete').send(query);
			const successStringMatch = `Users with the following ids have been deleted: ${query.ids}`;

			expect(res.statusCode).toEqual(200);
			expect(res.body.message).toEqual(successStringMatch);
		});
		it('| should not expect deleted employees to remain in the database', async () => {
			const forbiddenIds = [2, 3, 4, 5];
			const res = await request(app).get('/api/employees');
			const remainingEmployees = res.body.data;
			const containsForbidden = remainingEmployees.some((employee: Employee) =>
				forbiddenIds.includes(employee.id),
			);

			expect(containsForbidden).toBe(false);
		});

		describe('| Passing multiple employees "id" as a mixed array type inside of an object, with a key of "ids"', () => {
			it('should throw a "400" Bad Request error, with failing message', async () => {
				const query = { ids: [6, '7', { '8': 8 }, [9]] };
				const res = await request(app).delete('/api/employees/delete').send(query);
				const errorStringMatch = 'ID must be a number';
				expect(res.statusCode).toEqual(400);
				expect(res.body.error).toEqual(errorStringMatch);
			});
		});
	});
});
