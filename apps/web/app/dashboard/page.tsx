import Header from "@/components/Heading";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    redirect("/signin");
  }

  const user = await axios.get(`${process.env.BACKEND_URL!}/api/v1/user/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return (
    <div>
      <div>
        <h1>Hello {user.data.data.firstName}</h1>
      </div>
    </div>
  );
}
