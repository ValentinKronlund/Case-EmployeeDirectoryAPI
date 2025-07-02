/** @format */

import { useEffect, useState } from 'react';
import { useRequest } from './hooks/useRequest';
import { Employee } from './types';
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
	CircularProgress,
} from '@mui/material';
import { EmployeeHeader, EmployeeRow, ConfirmDialog, AddEmployee } from './components';
import { EmployeeResponseObject } from './types/Responses';

function App() {
	const [employees, setEmployees] = useState<Employee[]>([]);
	const [searchValue, setSearchValue] = useState<string>('');
	const [selectedEmployees, setSelectedEmployees] = useState<Employee['id'][]>([]);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);

	const {
		loading,
		error,
		execute: fetchEmployees,
	} = useRequest<EmployeeResponseObject>({
		url: `/employees`,
		method: 'GET',
		buildError: { message: 'Failed to fetch employees 🦧' },
	});

	const { execute: deleteSelectedEmployees } = useRequest({
		url: '/employees/delete',
		method: 'DELETE',
		body: { ids: selectedEmployees },
		buildError: { message: 'Failed to delete employee(s) 🦧' },
	});

	const { execute: searchEmployees } = useRequest({
		url: `/employees/search`,
		method: 'POST',
		body: { query: searchValue },
		buildError: { message: 'Failed to find a hit while searching for employee 🦧' },
	});

	const { execute: addEmployee } = useRequest({
		url: '/employees/add',
		method: 'POST',
		body: { newEmployee: {} },
		buildError: {
			message: `Failed to add new employee 🦧`,
		},
	});

	useEffect(() => {
		reloadEmployees();
	}, []);

	// ---------------- HANDLERS

	async function reloadEmployees() {
		const res = await fetchEmployees();
		if (res) {
			setEmployees(res.data ?? []);
		}
	}

	async function handleSearch(e: React.FormEvent) {
		e.preventDefault();

		if (searchValue.trim() === '') {
			await reloadEmployees();
		} else {
			const res = await searchEmployees({
				body: { query: searchValue },
			});
			if (Array.isArray(res)) setEmployees(res);
		}

		setSearchValue('');
	}

	async function handleAddEmployee(newEmployee: Omit<Employee, 'id'>) {
		await addEmployee({
			body: { newEmployee },
			buildError: {
				message: `Failed to add new employee ${newEmployee.name} ${newEmployee.surname}, ${newEmployee.email} 🦧`,
			},
		});
		await reloadEmployees();
	}

	function handleOpenDeletePopUp(e: React.FormEvent) {
		e.preventDefault();
		setDeleteDialogOpen(true);
	}

	async function handleDeleteConfirmation(answer: boolean) {
		if (answer) {
			await deleteSelectedEmployees({
				body: { ids: selectedEmployees },
			});
			await reloadEmployees();
			setDeleteDialogOpen(false);
			setSelectedEmployees([]);
		}
	}

	const handleSelectAllEmployees = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedEmployees(e.target.checked ? employees.map((e) => e.id) : []);
	};

	const handleSelectEmployee = (id: number) => {
		setSelectedEmployees((prev) =>
			prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
		);
	};

	// ------------- END OF HANDLERS

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
			{loading ? (
				<CircularProgress />
			) : (
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
			)}
			<Stack direction='row' spacing={2}>
				<Button
					variant='contained'
					color='error'
					onClick={handleOpenDeletePopUp}
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
				onClose={setDeleteDialogOpen}
				onSubmit={handleDeleteConfirmation}
				message='Are you sure you want to delete this employee?'
			/>

			<AddEmployee
				open={addEmployeeDialogOpen}
				onClose={setAddEmployeeDialogOpen}
				onSubmit={handleAddEmployee}
			/>
		</Box>
	);
}

export default App;
