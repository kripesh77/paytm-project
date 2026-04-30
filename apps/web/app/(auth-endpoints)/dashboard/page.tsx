import { Appbar } from "@/components/AppBar";
import { Balance } from "@/components/Balance";
import Header from "@/components/Heading";
import { Users } from "@/components/Users";

export default function page({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string; page?: string }>;
}) {
  return (
    <div>
      <div>
        <Appbar />
        <main>
          <div className="p-8">
            <Balance />
            <Users searchParams={searchParams} />
          </div>
        </main>
      </div>
    </div>
  );
}
