"use client";

import Header from "@/components/Heading";
import { useActionState } from "react";
import { SignupData } from "@/lib/actions";
import { SignupActionState } from "@/lib/types";
import InputAndLabel from "./InputBox";
import { SubHeading } from "./SubHeading";
import BottomWarning from "./BottomWarning";
import Button from "./Button";

export default function SignupPage() {
  const [data, action, isPending] = useActionState(
    SignupData as (
      state: SignupActionState | undefined,
      payload: FormData,
    ) => Promise<SignupActionState | undefined>,
    undefined,
  );
  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-white rounded-lg text-center p-6">
        <Header text="Signup" size="md" />
        <SubHeading label="Enter your information to create an account" />
        <form
          action={action}
          className="flex flex-col text-center justify-center gap-1"
        >
          <InputAndLabel
            data={data}
            name="username"
            label="Username"
            placeholder="Username"
          />
          <InputAndLabel
            data={data}
            name="email"
            label="Email"
            type="email"
            placeholder="john@doe.com"
          />
          <InputAndLabel
            data={data}
            name="firstName"
            label="First Name"
            placeholder="John"
          />
          <InputAndLabel
            data={data}
            name="lastName"
            label="Last Name"
            placeholder="Doe"
          />
          <InputAndLabel
            data={data}
            name="password"
            label="Password"
            type="password"
            placeholder="12345678"
          />
          <InputAndLabel
            data={data}
            name="passwordConfirm"
            label="Password Confirm"
            type="password"
            placeholder="12345678"
          />
          <div className="mt-4">
            <Button text="Sign up" isPending={isPending} />
          </div>
          <BottomWarning
            label="Already have an account?"
            buttonText="Sign in"
            to="/signin"
          />
        </form>
      </div>
    </div>
  );
}
