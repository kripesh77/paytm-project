import SigninPage from "@/components/SigninPage";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  let user = null;

  try {
    user = await axios.get(`${process.env.BACKEND_URL!}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {}

  if (user?.data.status === "success") {
    redirect("/dashboard");
  }
  return <SigninPage />;
}
