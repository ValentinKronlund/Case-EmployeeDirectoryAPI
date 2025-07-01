/** @format */

import { APIWrapperOptions, CustomError } from '../../types/interface';

export async function buildRequestWrapper<T = any>(
	apiOptions: APIWrapperOptions,
): Promise<T> {
	if (!apiOptions) {
		throw new Error(
			'❌ Error while building request wrapper -- API Options for the request have not been provided! ❌',
		);
	}
	const API_URL = process.env.REACT_APP_API_URL;
	const { url, method, headers, buildError, ...rest } = apiOptions;
	const fullUrl = `${API_URL}${url}`;

	const response = await fetch(fullUrl, {
		...rest,
		method: method,
		headers: {
			...headers,
			'Content-Type': 'application/json',
		},
		body: apiOptions.body ? JSON.stringify(apiOptions.body) : undefined,
	});

	if (!response.ok || response.status >= 400) {
		if (buildError) {
			console.error(`❌ API Request Failed ❌`, {
				url: fullUrl,
				method,
				status: buildError.status ?? response.status,
				body: apiOptions.body,
				data: await response.json().catch(() => {}),
				...buildError,
			});

			const error: CustomError = new Error(buildError.message);
			error.status = buildError.status;
			error.data = buildError.data;
			throw error;
		}

		throw new Error('An unknown error occurred.');
	}

	if (response.status === 204) return {} as T;

	return (await response.json()) as T;
}
