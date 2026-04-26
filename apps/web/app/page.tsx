// Server Component

import Header from "@/components/Header";

export default async function Page() {
  return (
    <div className="h-screen">
      <Header text="hello" size="lg" />
    </div>
  );
}
