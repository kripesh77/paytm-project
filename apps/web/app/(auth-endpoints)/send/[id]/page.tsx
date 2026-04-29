import { SendMoneyForm } from "@/components/SendMoneyForm";
import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SendMoney({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;

  if (!id) {
    redirect("/signin");
  }

  let friend = null;

  try {
    friend = await axios.get(
      `${process.env.BACKEND_URL!}/api/v1/user/detail/${id}`,
    );
  } catch (e) {}

  if (!friend) {
    return <div>User doesn&apos;t exist</div>;
  }

  const name = friend.data.data.firstName;
  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white capitalize">
                  {name[0]}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <SendMoneyForm />
          </div>
        </div>
      </div>
    </div>
  );
}
