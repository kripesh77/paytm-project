import axios from "axios";
import User from "./User";
import { SearchUsers } from "./SearchUsers";

export const Users = async ({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) => {
  const query = (await searchParams)?.query || "";
  const users = await axios.get(
    `${process.env.BACKEND_URL!}/api/v1/user/bulk?filter=${query}`,
  );
  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <SearchUsers />
      <div>
        {users.data.users.map((user: any) => (
          <User user={user} key={user._id} />
        ))}
      </div>
    </>
  );
};
