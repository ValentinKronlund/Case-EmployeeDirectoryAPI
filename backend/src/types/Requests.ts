/** @format */
import { Request } from 'express';
import { Employee } from './Employee';

export type NewEmployeeRequest = Request<any, any, { newEmployee: Omit<Employee, 'id'> }>;
export type SearchEmployeeRequest = Request<any, any, { query: string }>;
export type DeleteEmployeeRequestIDs = Request<any, any, { ids: number[] }>;
