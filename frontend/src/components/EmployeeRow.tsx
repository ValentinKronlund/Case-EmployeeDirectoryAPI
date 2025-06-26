/** @format */

import { Checkbox } from '@mui/material';
import { StyledTableRow, StyledTableCell, EMPLOYEE_KEYS } from '../utils/constants';
import { Employee } from '../types/Employee';

export function EmployeeRow({
	employee,
	selectedEmployees,
	handleSelectEmployee,
}: {
	employee: Employee;
	selectedEmployees: readonly number[];
	handleSelectEmployee: (e: React.MouseEvent<unknown>, id: number) => void;
}) {
	return (
		<StyledTableRow key={employee.id}>
			<StyledTableCell>
				<Checkbox
					color='primary'
					checked={selectedEmployees.includes(employee.id)}
					onClick={(e) => handleSelectEmployee(e, employee.id)}
				/>
			</StyledTableCell>
			{EMPLOYEE_KEYS.map((key) => (
				<StyledTableCell key={key} scope='row'>
					{employee[key]}
				</StyledTableCell>
			))}
		</StyledTableRow>
	);
}
