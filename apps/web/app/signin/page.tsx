import SigninPage from "@/components/SigninPage";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const user = await axios.get(`${process.env.BACKEND_URL!}/api/v1/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(token, user.data);
  if (user.data) {
    redirect("/dashboard");
  }
  return <SigninPage />;
}
