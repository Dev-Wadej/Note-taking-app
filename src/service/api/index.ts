import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import handleResponseError from "../../lib/handleResponseError";

let BASE_URL = "https://dummyapi.io/data/v1";

export { BASE_URL };

const requestHeaders: { [key: string]: string } = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "app-id": "6522e7e226d21b2501aa1380"
};

const Axios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: requestHeaders
  // withCredentials: true
});

// Add a request interceptor
Axios.interceptors.request.use(
  function (config: InternalAxiosRequestConfig) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
Axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger

    handleResponseError(error.response);
    throw error;
  }
);

export default Axios;
