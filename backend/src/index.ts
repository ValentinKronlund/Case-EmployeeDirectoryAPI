/** @format */

import express from 'express';
import employeeRoutes from './routes/employees';
import deleteEmployees from './routes/deleteEmployees';
import { seedEmployees } from './data/employeeStore';
import cors from 'cors';

const app = express();
const PORT = 4000;

app.use(cors());
app.use('/api/employees', employeeRoutes);
app.use('/api/deleteEmployees', deleteEmployees);

seedEmployees();

export const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost${PORT}`);
});

export default app;
