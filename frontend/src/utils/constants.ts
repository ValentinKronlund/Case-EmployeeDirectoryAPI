/** @format */

import { TableCell, TableRow, tableCellClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Employee } from '../types/Employee';

export const EMPLOYEE_KEYS: Array<keyof Employee> = ['id', 'name', 'surname', 'email'];

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
	[`&.${tableCellClasses.head}`]: {
		backgroundColor: '#a1d99b',
		color: '#005a32',
	},
	[`&.${tableCellClasses.body}`]: {
		fontSize: '14',
	},
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
	'&:nth-of-type(odd)': {
		backgroundColor: '#edf8e9',
	},
	'&:last-child td, &:last-child th': {
		border: 0,
	},
}));
