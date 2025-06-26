/** @format */

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	TextField,
} from '@mui/material';
import { useState, ChangeEvent, FC } from 'react';
import { Employee } from '../types/Employee';

interface AddEmployeeProps {
	open: boolean;
	onClose: () => void;
	onAdd: (newEmployee: Omit<Employee, 'id'>) => void;
}

export const AddEmployee: FC<AddEmployeeProps> = ({ open, onClose, onAdd }) => {
	const [form, setForm] = useState<Omit<Employee, 'id'>>({
		name: '',
		surname: '',
		email: '',
	});

	const handleChange =
		(field: keyof Omit<Employee, 'id'>) => (e: ChangeEvent<HTMLInputElement>) => {
			setForm((prev) => ({ ...prev, [field]: e.target.value }));
		};

	const handleSubmit = () => {
		onAdd(form);
		onClose();
		setForm({ name: '', surname: '', email: '' }); // reset
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Add New Employee</DialogTitle>
			<DialogContent
				sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '400px' }}>
				<TextField
					label='Name'
					value={form.name}
					onChange={handleChange('name')}
					fullWidth
				/>
				<TextField
					label='Surname'
					value={form.surname}
					onChange={handleChange('surname')}
					fullWidth
				/>
				<TextField
					label='Email'
					value={form.email}
					onChange={handleChange('email')}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					variant='contained'
					onClick={handleSubmit}
					disabled={!form.name || !form.email}>
					Add
				</Button>
			</DialogActions>
		</Dialog>
	);
};
