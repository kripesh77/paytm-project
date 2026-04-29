import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  return <>{children}</>;
}
