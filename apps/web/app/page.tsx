import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token");
  if (token) {
    redirect("/dashboard");
  } else {
    redirect("/signin");
  }
}
