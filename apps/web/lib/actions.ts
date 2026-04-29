"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  SigninActionState,
  SignupActionState,
  AuthActionErrors,
} from "./types";

export async function SigninData(
  _: SigninActionState | undefined,
  formData: FormData,
): Promise<SigninActionState | undefined> {
  const rawData = Object.fromEntries(formData.entries());
  const identifier = rawData.identifier as string;
  const password = rawData.password as string;

  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL!}/api/v1/auth/signin`,
      { identifier, password },
    );

    const { token } = response.data;

    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      let errors: AuthActionErrors = err.response?.data?.errors ||
        err.response?.data.message || {
          identifier: "Something went wrong",
        };

      if (err.response?.data.message === "Incorrect password") {
        errors = {
          password: "Incorrect password",
        };
      }

      if (err.response?.data.message === "User doesn't exist") {
        errors = {
          identifier: "User doesn't exist",
        };
      }
      return {
        error: errors,
        formData: { identifier, password },
      };
    }

    return { error: { error: "Unexpected error occurred" } };
  }

  redirect("/dashboard");
}

export async function SignupData(
  _: SignupActionState | undefined,
  formData: FormData,
): Promise<SignupActionState | undefined> {
  const rawData = Object.fromEntries(formData.entries());
  const username = rawData.username as string;
  const email = rawData.email as string;
  const firstName = rawData.firstName as string;
  const lastName = rawData.lastName as string;
  const password = rawData.password as string;
  const passwordConfirm = rawData.passwordConfirm as string;

  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL!}/api/v1/auth/signup`,
      { username, email, firstName, lastName, password, passwordConfirm },
    );

    const { token } = response.data;

    const cookieStore = await cookies();

    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const errors: AuthActionErrors = err.response?.data?.errors || {
        username: "Something went wrong",
      };
      return {
        error: errors,
        formData: {
          username,
          email,
          firstName,
          lastName,
          password,
          passwordConfirm,
        },
      };
    }

    return { error: { error: "Unexpected error occurred" } };
  }

  redirect("/dashboard");
}
