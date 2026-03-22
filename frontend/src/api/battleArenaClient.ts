import axios from 'axios';
import { BATTLEARENA_API_URL } from './config';

export const battleArenaClient = axios.create({
  baseURL: BATTLEARENA_API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});