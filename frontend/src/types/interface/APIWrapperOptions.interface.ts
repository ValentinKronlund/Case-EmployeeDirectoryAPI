/** @format */

export interface APIWrapperOptions extends RequestInit {
	url: string;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	body?: BodyInit | any;
	buildError?: {
		message: string;
		status?: number;
		name?: string;
		data?: any;
	};
}
