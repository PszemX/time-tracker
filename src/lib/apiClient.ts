export default async function apiClient<T>(
	url: string,
	options: RequestInit = {}
): Promise<T> {
	const response = await fetch(url, {
		...options,
		credentials: "include",
		headers: {
			...options.headers,
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.message || "Network error");
	}

	return response.json();
}
