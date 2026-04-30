"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useRef } from "react";

export const SearchUsers = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  function change(term: string) {
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const handleChange = (term: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => change(term), 500);
  };

  return (
    <div className="my-2">
      <input
        type="text"
        placeholder="Search users..."
        className="w-full px-2 py-1 border rounded border-slate-200"
        onChange={(e) => handleChange(e.target.value)}
        defaultValue={params.get("query")?.toString()}
      ></input>
    </div>
  );
};
