import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UserContext from "@/context/UserContext";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    redirect("/signin");
  }

  let user = null;

  try {
    user = await axios.get(`${process.env.BACKEND_URL!}/api/v1/user/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    console.log(e);
  } finally {
    if (!user) {
      redirect("/logout");
    }
  }
  return <UserContext user={user.data.data}>{children}</UserContext>;
}
