import Link from "next/link";

export default function Nav() {
  return (
    <header className="p-4 bg-primary">
      <nav>
        <ul className="flex justify-between">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/signin">signin</Link>
          </li>
          <li>
            <Link href="/signup">signup</Link>
          </li>
          <li>
            <Link href="/dashboard">dashboard</Link>
          </li>
          <li>
            <Link href="/send-money">send-money</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
