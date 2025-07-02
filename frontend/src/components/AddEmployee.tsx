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
	onClose: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (newEmployee: Omit<Employee, 'id'>) => Promise<void>;
}

export const AddEmployee: FC<AddEmployeeProps> = ({ open, onClose, onSubmit }) => {
	const [form, setForm] = useState<Omit<Employee, 'id'>>({
		name: '',
		surname: '',
		email: '',
	});

	function handleChange(
		e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
		field: keyof Omit<Employee, 'id'>,
	) {
		if (field === 'email') {
			setForm((prev) => ({ ...prev, [field]: e.target.value.toLowerCase() }));
		} else {
			setForm((prev) => ({ ...prev, [field]: e.target.value }));
		}
	}

	const handleSubmit = () => {
		onSubmit(form);
		setForm({ name: '', surname: '', email: '' });
		onClose(false);
	};

	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Add New Employee</DialogTitle>
			<DialogContent
				sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '400px' }}>
				<TextField
					label='Name'
					value={form.name}
					onChange={(e) => handleChange(e, 'name')}
					fullWidth
				/>
				<TextField
					label='Surname'
					value={form.surname}
					onChange={(e) => handleChange(e, 'surname')}
					fullWidth
				/>
				<TextField
					label='Email'
					value={form.email}
					onChange={(e) => handleChange(e, 'email')}
					fullWidth
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onClose(false)}>Cancel</Button>
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
