export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const MIN_PASSWORD_LENGTH = 6;

export function validateEmailFormat(trimmed: string): string | null {
  if (!trimmed) return 'Please enter your email.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email address.';
  return null;
}

export type SignUpFormValues = {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
};

export function validateSignUpForm(f: SignUpFormValues): string | null {
  if (!f.username.trim()) return 'Please enter a username.';
  if (!f.firstName.trim()) return 'Please enter your first name.';
  if (!f.lastName.trim()) return 'Please enter your last name.';
  
  const emailErr = validateEmailFormat(f.email.trim());
  if (emailErr) return emailErr;
  
  if (!f.phone.trim()) return 'Please enter your phone number.';
  if (!f.password) return 'Please enter a password.';
  if (f.password.length < MIN_PASSWORD_LENGTH) 
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (f.password !== f.confirmPassword) return 'Passwords do not match.';
  
  return null;
}