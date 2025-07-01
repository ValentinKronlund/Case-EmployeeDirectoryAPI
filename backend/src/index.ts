/** @format */

import express from 'express';
import employeesRouter from './routes/employeesRouter';
import { seedDatabase } from './data/utils/fileSystemAsync.utils';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use('/api/employees', employeesRouter);

seedDatabase();

export const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
