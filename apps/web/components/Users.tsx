import Button from "./Button";
import axios from "axios";
import User from "./User";

export const Users = async () => {
  const users = await axios.get(`${process.env.BACKEND_URL!}/api/v1/user/bulk`);
  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="my-2">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        ></input>
      </div>
      <div>
        {users.data.users.map((user: any) => (
          <User user={user} key={user._id} />
        ))}
      </div>
    </>
  );
};
