/** @format */

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@mui/material';
import { FC } from 'react';

interface ConfirmDialogProps {
	message: string;
	open: boolean;
	onClose: React.Dispatch<React.SetStateAction<boolean>>;
	onSubmit: (bool: boolean) => void;
}

export const ConfirmDialog: FC<ConfirmDialogProps> = ({
	message,
	open,
	onClose,
	onSubmit,
}) => {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Confirm</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={() => onClose(false)}>Cancel</Button>
				<Button onClick={() => onSubmit(true)} color='primary' variant='contained'>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
};
