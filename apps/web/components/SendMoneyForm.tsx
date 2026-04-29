"use client";

import { sendMoney } from "@/lib/actions";
import { BalanceTransferActionState } from "@/lib/types";
import { useParams } from "next/navigation";
import { useActionState } from "react";

export const SendMoneyForm = () => {
  const { id } = useParams();
  const [data, action, isPending] = useActionState(
    sendMoney as (
      state: BalanceTransferActionState | undefined,
      payload: FormData,
    ) => Promise<BalanceTransferActionState | undefined>,
    undefined,
  );

  return (
    <form action={action}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="amount"
          >
            Amount (in Rs)
          </label>
          <input
            type="number"
            className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ${data?.error && data.error["amount"] && "border-red-500 outline-red-500"}`}
            id="amount"
            name="amount"
            placeholder="Enter amount"
            defaultValue={data?.formData && data.formData["amount"]}
          />
          {data?.error && data.error["amount"] && (
            <p className="text-red-500 text-sm">{data.error["amount"]}</p>
          )}
          <input hidden name="to" defaultValue={id} />
        </div>
        <button
          disabled={isPending}
          className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white cursor-pointer not-disabled:hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-green-300"
        >
          Initiate Transfer
        </button>
      </div>
    </form>
  );
};
