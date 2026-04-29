/**
 * Form data types for authentication
 */

// Signin form data
export interface SigninFormData {
  identifier: string;
  password: string;
}

// Signup form data
export interface SignupFormData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  passwordConfirm: string;
}

/**
 * Action return types (returned on validation/error)
 */
export interface AuthActionErrors {
  [key: string]: string | undefined;
}

export interface SigninActionState {
  error?: AuthActionErrors;
  formData?: SigninFormData;
}

export interface SignupActionState {
  error?: AuthActionErrors;
  formData?: SignupFormData;
}

// Combined error type for unexpected errors
export type AuthError = AuthActionErrors | { error: string };

// Type guard to check if action returned an error state
export function isActionError(
  state: SigninActionState | SignupActionState | undefined,
): state is SigninActionState | SignupActionState {
  return !!state?.error;
}
