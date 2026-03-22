import { useMutation } from '@tanstack/react-query';
import { signUpUser, type SignUpUserPayload } from '../api/users';

export function useSignUpMutation() {
  return useMutation({
    mutationFn: (payload: SignUpUserPayload) => signUpUser(payload),
  });
}