"use client";

import Header from "@/components/Header";
import { useActionState } from "react";
import { saveFormData } from "@/lib/actions";

export default function SigninPage() {
  const [data, action, isPending] = useActionState(saveFormData, undefined);
  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl text-center">
        <Header text="Signin" size="lg" />
        <form
          action={action}
          className="flex flex-col text-center justify-center items-center gap-4 mt-6"
        >
          <div className="flex flex-col text-start">
            <input
              className={`peer border rounded px-4 py-2 ${data?.error && data?.error["identifier"] && "border-red-500 outline-red-500"}`}
              type="text"
              id="identifier"
              name="identifier"
              placeholder=""
              defaultValue={data?.error && data?.formData?.identifier}
            />
            <label
              htmlFor="identifier"
              className="absolute translate-y-1/2 translate-x-3 text-slate-600 select-none pointer-events-none transition-all peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:text-sm peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:text-sm"
            >
              Email or Username
            </label>
            <p className="text-red-500 text-sm">
              {data?.error && data?.error["identifier"]}
            </p>
          </div>
          <div className="flex flex-col text-start">
            <input
              className={`peer border rounded px-4 py-2 ${data?.error?.["password"] && "border-red-500 outline-red-500"}`}
              type="password"
              name="password"
              placeholder=""
              defaultValue={data?.error && data?.formData?.password}
            />
            <label
              htmlFor="password"
              className="absolute translate-y-1/2 translate-x-3 text-slate-600 select-none pointer-events-none transition-[transform,font,translate] peer-focus:-translate-y-1/2 peer-focus:bg-white peer-focus:text-sm peer-not-placeholder-shown:-translate-y-1/2 peer-not-placeholder-shown:bg-white peer-not-placeholder-shown:text-sm"
            >
              Password
            </label>
            <p className="text-red-500 text-sm">{data?.error?.["password"]}</p>
          </div>
          <button
            disabled={isPending}
            className="px-4 py-2 bg-black rounded-full text-white disabled:bg-slate-700 disabled:cursor-not-allowed"
          >
            submit
          </button>
        </form>
      </div>
    </div>
  );
}
