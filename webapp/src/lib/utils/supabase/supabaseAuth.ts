import {
  AuthError,
  AuthResponse,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  UserResponse,
} from "@supabase/supabase-js";
import { SupabaseAuthClient } from "@supabase/supabase-js/dist/module/lib/SupabaseAuthClient";
import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from "react-query";
export function addDefaultErrorHandling(
  useMutationOptions?: UseMutationOptions<any, any, any>,
  enqueueSnackbar?: (message: string, options?: any) => void
) {
  if (useMutationOptions === undefined) {
    useMutationOptions = {};
  }
  if (useMutationOptions.onError === undefined) {
    useMutationOptions.onError = (error) => {
      if (enqueueSnackbar !== undefined) {
        enqueueSnackbar(error.message, {
          variant: "error",
        });
      } else {
        console.error(error);
      }
    };
  }
  return useMutationOptions;
}

export function useAuthSignUpWithPassword(
  auth: SupabaseAuthClient,
  enqueueSnackbar?: (message: string, options?: any) => void,
  useMutationOptions?: UseMutationOptions<
    AuthResponse,
    AuthError,
    SignUpWithPasswordCredentials
  >
): UseMutationResult<AuthResponse, AuthError, SignUpWithPasswordCredentials> {
  useMutationOptions = addDefaultErrorHandling(
    useMutationOptions,
    enqueueSnackbar
  );

  return useMutation<AuthResponse, AuthError, SignUpWithPasswordCredentials>(
    (credentials) => {
      return auth.signUp(credentials);
    },
    useMutationOptions
  );
}
export function useAuthSignInWithPassword(
  auth: SupabaseAuthClient,
  enqueueSnackbar?: (message: string, options?: any) => void,
  useMutationOptions?: UseMutationOptions<
    AuthResponse,
    AuthError,
    SignInWithPasswordCredentials
  >
): UseMutationResult<AuthResponse, AuthError, SignInWithPasswordCredentials> {
  useMutationOptions = addDefaultErrorHandling(
    useMutationOptions,
    enqueueSnackbar
  );
  return useMutation<AuthResponse, AuthError, SignInWithPasswordCredentials>(
    (credentials) => {
      return auth.signInWithPassword(credentials);
    },
    useMutationOptions
  );
}

export function useAuthSendPasswordResetEmail(
  auth: SupabaseAuthClient,
  enqueueSnackbar?: (message: string, options?: any) => void,
  useMutationOptions?: UseMutationOptions<
    { data: {}; error: null } | { data: null; error: AuthError },
    AuthError,
    string
  >
): UseMutationResult<
  { data: {}; error: null } | { data: null; error: AuthError },
  AuthError,
  string
> {
  useMutationOptions = addDefaultErrorHandling(
    useMutationOptions,
    enqueueSnackbar
  );
  return useMutation<
    { data: {}; error: null } | { data: null; error: AuthError },
    AuthError,
    string
  >((credentials) => {
    return auth.resetPasswordForEmail(credentials);
  }, useMutationOptions);
}

export function useAuthUpdatePassword(
  auth: SupabaseAuthClient,
  enqueueSnackbar?: (message: string, options?: any) => void,
  useMutationOptions?: UseMutationOptions<UserResponse, AuthError, string>
): UseMutationResult<UserResponse, AuthError, string> {
  useMutationOptions = addDefaultErrorHandling(
    useMutationOptions,
    enqueueSnackbar
  );
  return useMutation<UserResponse, AuthError, string>((credentials) => {
    return auth.updateUser({ password: credentials });
  }, useMutationOptions);
}
