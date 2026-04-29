import clsx from "clsx";

interface HeaderType {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: clsx("text-2xl"),
  md: clsx("text-4xl"),
  lg: clsx("text-6xl"),
};

const defaultStyles = clsx("font-bold");

export default function Header({ text, size = "md", className }: HeaderType) {
  return (
    <h1 className={`${defaultStyles} ${sizes[size]} ${className}`}>{text}</h1>
  );
}
