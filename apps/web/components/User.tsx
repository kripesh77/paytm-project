import Button from "./Button";
import Link from "next/link";

export default function User({ user }: { user: any }) {
  return (
    <div className="flex justify-between">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2">
          <div className="flex flex-col justify-center h-full text-xl capitalize">
            {user.firstName[0]}
          </div>
        </div>
        <div className="flex flex-col justify-center h-ful">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center h-ful">
        <Link href={`send/${user._id}`}>
          <Button text={"Send Money"} />
        </Link>
      </div>
    </div>
  );
}
