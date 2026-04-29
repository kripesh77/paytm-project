"use client";

import { useUser } from "@/context/UserContext";

export const Appbar = () => {
  const user = useUser();
  const { firstName = "A" } = user.user;
  return (
    <header>
      <nav>
        <div className="shadow h-14 flex justify-between">
          <div className="flex flex-col justify-center h-full ml-4">
            PayTM App
          </div>
          <div className="flex">
            <div className="flex flex-col justify-center h-full mr-4">
              Hello
            </div>
            <div
              className="rounded-full h-12 w-12 bg-slate-200 flex justify-center mt-1 mr-2 cursor-pointer"
              title={firstName}
            >
              <div className="flex flex-col justify-center h-full text-xl capitalize">
                {firstName[0]}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
