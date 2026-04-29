"use client";

import Header from "@/components/Heading";
import { useActionState } from "react";
import { SigninData } from "@/lib/actions";
import { SigninActionState } from "@/lib/types";
import InputAndLabel from "./InputBox";
import Button from "./Button";
import { SubHeading } from "./SubHeading";
import BottomWarning from "./BottomWarning";

export default function SigninPage() {
  const [data, action, isPending] = useActionState(
    SigninData as (
      state: SigninActionState | undefined,
      payload: FormData,
    ) => Promise<SigninActionState | undefined>,
    undefined,
  );
  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl text-center">
        <Header text="Signin" size="md" />
        <SubHeading label="Enter your credentials to access your account" />
        <form
          action={action}
          className="flex flex-col text-center justify-center gap-1"
        >
          <InputAndLabel
            data={data}
            name="identifier"
            label="Email or Username"
            placeholder="Email or Username"
          />
          <InputAndLabel
            data={data}
            name="password"
            label="Password"
            type="password"
            placeholder="12345678"
          />
          <div className="mt-4">
            <Button text="Sign in" isPending={isPending} />
          </div>
          <BottomWarning
            to="/signup"
            label="Don't have an account?"
            buttonText="Sign up"
          />
        </form>
      </div>
    </div>
  );
}
