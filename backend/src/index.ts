/** @format */

import express from 'express';
import employeesRouter from './routes/employeesRouter';
import { seedDatabase } from './data/utils/fileSystemAsync.utils';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/api/employees', employeesRouter);

export const server = app.listen(PORT, async () => {
	if (process.env.NODE_ENV !== 'test') {
		await seedDatabase();
	}
	console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
