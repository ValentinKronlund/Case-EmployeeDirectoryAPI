/** @format */
import { useState, useCallback } from 'react';
import { APIWrapperOptions } from '../types/interface';
import { buildRequestWrapper } from '../utils/wrappers/apiRequestWrapper';

type UseRequestResult<T> = {
	data: T | null;
	loading: boolean;
	error: Error | null;
	execute: (optionsOverride?: Partial<APIWrapperOptions>) => Promise<T | void>;
};

export function useRequest<T = any>(
	initialOptions: APIWrapperOptions,
): UseRequestResult<T> {
	const [data, setData] = useState<T | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const execute = useCallback(
		async (optionsOverride?: Partial<APIWrapperOptions>) => {
			setLoading(true);
			setError(null);

			try {
				const mergedOptions = {
					...initialOptions,
					...optionsOverride,
					headers: {
						...(initialOptions.headers || {}),
						...(optionsOverride?.headers || {}),
					},
					body: optionsOverride?.body ?? initialOptions.body,
				};

				const response = await buildRequestWrapper<T>(mergedOptions);
				setData(response);
				return response;
			} catch (error: any) {
				setError(error);
			} finally {
				setLoading(false);
			}
		},
		[initialOptions],
	);

	return { data, loading, error, execute };
}
