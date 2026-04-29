import SignupPage from "@/components/SignupPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    redirect("/dashboard");
  }
  return <SignupPage />;
}
