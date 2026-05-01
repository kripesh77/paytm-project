import axios from "axios";
import User from "./User";
import { SearchUsers } from "./SearchUsers";
import { cookies } from "next/headers";

export const Users = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const query = (await searchParams)?.query || "";
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  const users = await axios.get(
    `${process.env.BACKEND_URL!}/api/v1/user/bulk?filter=${query}&fields=firstName,lastName&page=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  console.log(users.data);
  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <SearchUsers />
      <div>
        {users.data.data.users.map((user: any) => (
          <User user={user} key={user._id} />
        ))}
      </div>
    </>
  );
};
