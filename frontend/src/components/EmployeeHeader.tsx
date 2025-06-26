/** @format */

import { Checkbox, TableRow } from '@mui/material';
import { StyledTableCell, EMPLOYEE_KEYS } from '../utils/constants';

export function EmployeeHeader({
	selectedEmployees,
	handleSelectAllEmployees,
}: {
	selectedEmployees: readonly number[];
	handleSelectAllEmployees: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
	return (
		<TableRow>
			<StyledTableCell>
				<Checkbox
					checked={selectedEmployees.length > 0}
					onChange={handleSelectAllEmployees}
				/>
			</StyledTableCell>
			{EMPLOYEE_KEYS.map((key) => (
				<StyledTableCell key={key}>{key.toUpperCase()}</StyledTableCell>
			))}
		</TableRow>
	);
}
