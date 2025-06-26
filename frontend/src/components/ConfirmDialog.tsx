/** @format */

import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@mui/material';

export function ConfirmDialog({ open, onClose, onConfirm, message }: any) {
	return (
		<Dialog open={open} onClose={onClose}>
			<DialogTitle>Confirm</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={onConfirm} color='primary' variant='contained'>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
}
