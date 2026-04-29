import { SigninActionState, SignupActionState } from "@/lib/types";

type AuthActionState = SigninActionState | SignupActionState;

interface InputBoxProps {
  data: AuthActionState | undefined;
  name: string;
  label: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
}

export default function InputBox({
  data,
  name,
  label,
  type = "text",
  placeholder = "",
}: InputBoxProps) {
  const hasError = Boolean(data?.error && data?.error[name]);
  const errorMessage = data?.error?.[name];
  const defaultValue = data?.formData?.[name as keyof typeof data.formData];

  return (
    <div className="flex flex-col text-start w-full text-sm">
      <label
        htmlFor={name}
        className={`font-medium text-left py-2 ${hasError && "text-red-500"}`}
      >
        {label}
      </label>
      <input
        className={`w-full px-2 py-1 border rounded ${
          hasError ? "border-red-500 outline-red-500" : "border-slate-200"
        }`}
        type={type}
        id={name}
        name={name}
        placeholder={placeholder}
        defaultValue={typeof defaultValue === "string" ? defaultValue : ""}
      />
      <p className="text-red-500 text-sm">{errorMessage}</p>
    </div>
  );
}
