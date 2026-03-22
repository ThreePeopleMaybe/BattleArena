import { useCallback, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { validateEmailFormat } from '../validation/auth';

export function useLoginForm(onLoggedIn: () => void | Promise<void>) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onLoggedInRef = useRef(onLoggedIn);
  onLoggedInRef.current = onLoggedIn;

  const submit = useCallback(async () => {
    setError('');
    const trimmedEmail = email.trim();
    const emailErr = validateEmailFormat(trimmedEmail);
    if (emailErr) {
      setError(emailErr);
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    
    await login(trimmedEmail, password);
    await onLoggedInRef.current();
  }, [email, password, login]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    submit,
  };
}