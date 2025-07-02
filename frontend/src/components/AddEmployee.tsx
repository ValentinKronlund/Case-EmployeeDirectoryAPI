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
		const input = e.target.value;
		const nameRegex = /[^a-zA-Z\s]/g;

		if (field === 'email') {
			setForm((prev) => ({ ...prev, [field]: input.toLowerCase() }));
		} else {
			const onlyAlphabetics = input.replace(nameRegex, '');
			setForm((prev) => ({ ...prev, [field]: onlyAlphabetics }));
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
					required
				/>
				<TextField
					label='Surname'
					type='text'
					value={form.surname}
					onChange={(e) => handleChange(e, 'surname')}
					fullWidth
					required
				/>
				<TextField
					label='Email'
					type='email'
					value={form.email}
					onChange={(e) => handleChange(e, 'email')}
					fullWidth
					required
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
