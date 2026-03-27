import axios from 'axios';
import { BATTLEARENA_API_URL } from './config';
import { BattleArenaApiError, messageFromAxiosError } from './httpErrorMessage';

export const battleArenaClient = axios.create({
  baseURL: BATTLEARENA_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

battleArenaClient.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = messageFromAxiosError(error)  ;
      return Promise.reject(new BattleArenaApiError(message, {status, cause: error }));
    }
    return Promise.reject(error);
  }
);