"use server";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function saveFormData(_: unknown, formData: FormData) {
  const { identifier, password } = Object.fromEntries(formData.entries());
  
  try {
    const response = await axios.post(
      `${process.env.BACKEND_URL!}/api/v1/auth/signin`,
      { identifier, password },
    );

    const { token, user } = response.data;

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
      return {
        error: err.response?.data?.errors || "Something went wrong",
        formData: { identifier, password },
      };
    }

    return { error: "Unexpected error occurred" };
  }

  redirect("/dashboard");
}
