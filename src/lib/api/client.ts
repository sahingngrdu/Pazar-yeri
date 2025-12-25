const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.meshur.co';

interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: Record<string, unknown>;
    params?: Record<string, string | number | boolean | undefined>;
}

interface ApiResponse<T> {
    data: T;
    status: number;
    ok: boolean;
}

interface ApiError {
    message: string;
    status: number;
    code?: string;
}

/**
 * Generic API client with error handling and type safety
 */
class ApiClient {
    private baseUrl: string;
    private defaultHeaders: HeadersInit;

    constructor(baseUrl: string = API_BASE_URL) {
        this.baseUrl = baseUrl;
        this.defaultHeaders = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        };
    }

    private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
        const url = new URL(endpoint, this.baseUrl);

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, String(value));
                }
            });
        }

        return url.toString();
    }

    private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
        const contentType = response.headers.get('content-type');
        const isJson = contentType?.includes('application/json');

        if (!response.ok) {
            const error: ApiError = {
                message: 'An error occurred',
                status: response.status,
            };

            if (isJson) {
                try {
                    const errorData = await response.json();
                    error.message = errorData.message || error.message;
                    error.code = errorData.code;
                } catch {
                    // Ignore JSON parse error
                }
            }

            throw error;
        }

        const data = isJson ? await response.json() : null;
        return {
            data,
            status: response.status,
            ok: response.ok,
        };
    }

    async get<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        const { params, headers, body: _body, ...rest } = options;
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'GET',
            headers: { ...this.defaultHeaders, ...headers },
            ...rest,
        });

        return this.handleResponse<T>(response);
    }

    async post<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        const { body, params, headers, ...rest } = options;
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'POST',
            headers: { ...this.defaultHeaders, ...headers },
            body: body ? JSON.stringify(body) : undefined,
            ...rest,
        });

        return this.handleResponse<T>(response);
    }

    async put<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        const { body, params, headers, ...rest } = options;
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'PUT',
            headers: { ...this.defaultHeaders, ...headers },
            body: body ? JSON.stringify(body) : undefined,
            ...rest,
        });

        return this.handleResponse<T>(response);
    }

    async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
        const { params, headers, body: _body, ...rest } = options;
        const url = this.buildUrl(endpoint, params);

        const response = await fetch(url, {
            method: 'DELETE',
            headers: { ...this.defaultHeaders, ...headers },
            ...rest,
        });

        return this.handleResponse<T>(response);
    }

    /**
     * Set authorization token for authenticated requests
     */
    setAuthToken(token: string) {
        this.defaultHeaders = {
            ...this.defaultHeaders,
            Authorization: `Bearer ${token}`,
        };
    }

    /**
     * Clear authorization token
     */
    clearAuthToken() {
        const { Authorization, ...rest } = this.defaultHeaders as Record<string, string>;
        this.defaultHeaders = rest;
    }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for testing or multiple instances
export { ApiClient };
