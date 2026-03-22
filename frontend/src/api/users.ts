import axios, { AxiosError } from 'axios';
import { battleArenaClient } from './battleArenaClient';

export interface UserDto {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string | null;
  amount: number | null;
}

export interface SignUpUserPayload {
  username: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phoneNumber: string;
  amount: number | null;
}

function normalizeUserDto(data: unknown): UserDto {
  const d = data as Record<string, unknown>;
  return {
    id: Number(d.id),
    username: String(d.username ?? ''),
    firstName: String(d.firstName ?? ''),
    lastName: String(d.lastName ?? ''),
    email: d.email != null ? String(d.email) : null,
    phoneNumber: d.phoneNumber != null ? String(d.phoneNumber) : null,
    amount: d.amount != null && d.amount !== '' ? Number(d.amount) : null,
  };
}

function messageFromResponseBody(data: unknown): string | null {
  if (data == null) return null;
  if (typeof data === 'string') {
    const t = data.trim();
    return t.length > 0 ? t : null;
  }
  if (typeof data === 'object') {
    const o = data as { title?: unknown; detail?: unknown };
    if (typeof o.title === 'string' && o.title.trim()) return o.title.trim();
    if (typeof o.detail === 'string' && o.detail.trim()) return o.detail.trim();
  }
  return null;
}

function getSignupErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const ax = error as AxiosError<unknown>;
    const status = ax.response?.status;
    const fromBody = messageFromResponseBody(ax.response?.data);

    if (fromBody) return fromBody;
    if (status === 409) return 'Username or email already exists.';
    if (status != null) return `Sign up failed (${status}).`;
  }
  if (error instanceof Error) return error.message;
  return 'Failed to create account.';
}

export async function signUpUser(payload: SignUpUserPayload): Promise<UserDto> {
  try {
    const { data } = await battleArenaClient.post<unknown>('/api/v1/users/signup', {
      username: payload.username,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phoneNumber: payload.phoneNumber,
      amount: payload.amount,
    });
    return normalizeUserDto(data);
  } catch (e) {
    throw new Error(getSignupErrorMessage(e));
  }
}