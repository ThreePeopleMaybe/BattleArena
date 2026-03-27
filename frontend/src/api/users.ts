import axios, { AxiosError } from 'axios';
import { battleArenaClient } from './battleArenaClient';
import { BattleArenaApiError, messageFromResponseBody } from './httpErrorMessage';

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

function getSignupErrorMessage(error: unknown): string {
  if (error instanceof BattleArenaApiError) {
    if (error.status === 409) return 'Username or email already exists.';
    return error.message;
  }
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