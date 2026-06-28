import {AxiosResponse} from 'axios';

interface ApiResponse<T> {
    success?: boolean;
    data?: T;
    count?: number;
    message?: string;
}

export function unwrapData<T>(response: AxiosResponse<ApiResponse<T> | T>): T {
    const body = response.data;
    if (body && typeof body === 'object' && 'data' in body) {
        return (body as ApiResponse<T>).data as T;
    }
    return body as T;
}

export function unwrapList<T>(response: AxiosResponse): T[] {
    const data = unwrapData<T[] | T>(response);
    return Array.isArray(data) ? data : [];
}
