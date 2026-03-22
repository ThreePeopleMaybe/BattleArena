import { useCallback, useReducer, useRef, useState } from 'react';
import type { UserDto } from '../api/users';
import { validateSignUpForm, type SignUpFormValues } from '../validation/auth';
import { useSignUpMutation } from './useSignUpMutation';

export type SignUpCredentials = { email: string; password: string };

const initialForm: SignUpFormValues = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

type SignUpFormAction = 
  | { type: 'set'; field: keyof SignUpFormValues; value: string }
  | { type: 'reset' };

function signUpFormReducer(state: SignUpFormValues, action: SignUpFormAction): SignUpFormValues {
  if (action.type === 'reset') return initialForm;
  return { ...state, [action.field]: action.value };
}

export function useSignUpForm(
  onSuccess: (created: UserDto, credentials: SignUpCredentials) => void | Promise<void>
) {
  const mutation = useSignUpMutation();
  const [form, dispatch] = useReducer(signUpFormReducer, initialForm);
  const [error, setError] = useState('');

  const onSuccessRef = useRef(onSuccess);
  onSuccessRef.current = onSuccess;

  const setField = useCallback((field: keyof SignUpFormValues, value: string) => {
    dispatch({ type: 'set', field, value });
  }, []);

  const submit = useCallback(() => {
    setError('');
    const validationError = validateSignUpForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmedUsername = form.username.trim();
    const trimmedFirst = form.firstName.trim();
    const trimmedLast = form.lastName.trim();
    const trimmedEmail = form.email.trim();
    const trimmedPhone = form.phone.trim();
    const password = form.password;

    mutation.mutate(
      {
        username: trimmedUsername,
        firstName: trimmedFirst,
        lastName: trimmedLast,
        email: trimmedEmail,
        phoneNumber: trimmedPhone,
        amount: null,
      },
      {
        onSuccess: async (created) => {
          await onSuccessRef.current(created, { email: trimmedEmail, password });
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Failed to create account.';
          setError(msg);
        },
      }
    );
  }, [form, mutation]);

  return {
    form,
    setField,
    error,
    isSubmitting: mutation.isPending,
    submit,
  };
}