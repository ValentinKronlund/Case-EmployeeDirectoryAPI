/** @format */

import { useEffect, useState } from 'react';
import {
	TableContainer,
	Table,
	Paper,
	TableHead,
	TableBody,
	TextField,
	Button,
	Box,
	Stack,
	Typography,
} from '@mui/material';
import { Employee } from './types/Employee';
import {
	deleteEmployees,
	fetchAllEmployees,
	searchEmployees,
	createEmployee,
} from './services/employeeService';
import { EmployeeHeader } from './components/EmployeeHeader';
import { EmployeeRow } from './components/EmployeeRow';
import { ConfirmDialog } from './components/ConfirmDialog';
import { AddEmployee } from './components/AddEmployee';

function App() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [searchValue, setSearchValue] = useState<String>('');
	const [selectedEmployees, setSelectedEmployees] = useState<readonly Employee['id'][]>(
		[],
	);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);

	const handleSelectAllEmployees = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedEmployees(e.target.checked ? employees.map((e) => e.id) : []);
	};

	const handleSelectEmployee = (e: React.MouseEvent<unknown>, id: number) => {
		setSelectedEmployees((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();

		if (searchValue.trim() === '') {
			await fetchAllEmployees().then(setEmployees).catch(console.error);
			setSearchValue('');
		} else {
			await searchEmployees(searchValue.trim()).then(setEmployees).catch(console.error);
			setSearchValue('');
		}
	};

	const handleDeleteSelected = (e: React.FormEvent) => {
		e.preventDefault();
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirmation = async (answer: boolean) => {
		setDeleteDialogOpen(false);
		if (answer) {
			await deleteEmployees(selectedEmployees);
			await fetchAllEmployees().then(setEmployees).catch(console.error);
			setSelectedEmployees([]);
			setSearchValue('');
		}
	};

	const handleAddEmployee = async (newEmployee: Omit<Employee, 'id'>) => {
		setAddEmployeeDialogOpen(true);
		await createEmployee(newEmployee)
			.then((e) => console.log(e))
			.catch(console.error);
		await fetchAllEmployees().then(setEmployees).catch(console.error);
	};

	useEffect(() => {
		fetchAllEmployees().then(setEmployees).catch(console.error);
	}, []);

	return (
		<Box
			display='flex'
			justifyContent='center'
			alignItems='center'
			minHeight='100vh'
			flexDirection='column'
			gap={4}
			padding={2}>
			<Typography variant='h4' gutterBottom>
				Employee Directory
			</Typography>

			<form onSubmit={handleSearch}>
				<Stack direction='row' spacing={2}>
					<TextField
						label='Search'
						variant='outlined'
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
					/>
					<Button variant='outlined' type='submit'>
						Search
					</Button>
				</Stack>
			</form>

			<TableContainer component={Paper} sx={{ maxWidth: 650, maxHeight: 440 }}>
				<Table stickyHeader aria-label='Employees Table'>
					<TableHead>
						<EmployeeHeader
							selectedEmployees={selectedEmployees}
							handleSelectAllEmployees={handleSelectAllEmployees}
						/>
					</TableHead>
					<TableBody>
						{employees.map((employee) => (
							<EmployeeRow
								key={employee.id}
								employee={employee}
								selectedEmployees={selectedEmployees}
								handleSelectEmployee={handleSelectEmployee}
							/>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<Stack direction='row' spacing={2}>
				<Button
					variant='contained'
					color='error'
					onClick={handleDeleteSelected}
					disabled={selectedEmployees.length === 0}>
					Delete Selected
				</Button>
				<Button
					variant='contained'
					color='success'
					onClick={() => setAddEmployeeDialogOpen(true)}>
					Add Employee
				</Button>
			</Stack>

			<ConfirmDialog
				open={deleteDialogOpen}
				onClose={() => setDeleteDialogOpen(false)}
				onConfirm={handleDeleteConfirmation}
				message='Are you sure you want to delete this employee?'
			/>

			<AddEmployee
				open={addEmployeeDialogOpen}
				onClose={() => setAddEmployeeDialogOpen(false)}
				onAdd={handleAddEmployee}
			/>
		</Box>
	);
}

export default App;
