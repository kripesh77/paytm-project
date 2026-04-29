"use client";
import { useUser } from "@/context/UserContext";

export const Balance = () => {
  const user = useUser();
  const { balance: balanceInPaisa = 0 } = user;
  const balanceInRs = balanceInPaisa / 100;
  return (
    <div className="flex">
      <div className="font-bold text-lg">Your balance</div>
      <div className="font-semibold ml-4 text-lg">
        Rs {balanceInRs.toFixed(2)}
      </div>
    </div>
  );
};
