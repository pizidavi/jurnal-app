import axios, { AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { apiLog } from '../util/logger';

const axiosClient = axios.create({
  // baseURL: API_URL,
});

const requestInterceptor = (request: InternalAxiosRequestConfig) => {
  apiLog.debug(`Called ${request.baseURL ?? '-'} ${request.url ?? '-'}`);
  return request;
};

const responseInterceptor = (response: AxiosResponse) => {
  const data = response.data as { code: number; message: string } | undefined;
  if (data?.code !== 200)
    throw new AxiosError(
      data?.message ?? 'Error',
      data?.code.toString(),
      response.config,
      response.request,
      response,
    );
  return response;
};

const errorLoggerInterceptor = (error: AxiosError) => {
  apiLog.warn(`Error on ${error.config?.url ?? '-'}: ${JSON.stringify(error.response?.data)}`);
  throw error;
};

axiosClient.interceptors.request.use(requestInterceptor);
axiosClient.interceptors.response.use(responseInterceptor, errorLoggerInterceptor);

export { axiosClient };
