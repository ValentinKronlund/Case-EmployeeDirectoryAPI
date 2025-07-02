/** @format */

import { server } from '..';
import { seedDatabase } from '../data/utils/fileSystemAsync.utils';

beforeAll(async () => {
	await seedDatabase();
});

afterAll((done) => {
	server.close(done);
});
