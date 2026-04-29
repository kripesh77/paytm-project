import Link from "next/link";

interface IBottomWarningProps {
  label: string;
  buttonText: string;
  to: string;
}

export default function BottomWarning({
  label,
  buttonText,
  to,
}: IBottomWarningProps) {
  return (
    <div className="py-2 text-sm flex justify-center">
      <div>{label}</div>
      <Link className="pointer underline pl-1 cursor-pointer" href={to}>
        {buttonText}
      </Link>
    </div>
  );
}
