import clsx from "clsx";

interface HeaderType {
  text: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: clsx("text-xl"),
  md: clsx("text-2xl"),
  lg: clsx("text-3xl"),
};

const defaultStyles = clsx("font-bold");

export default function Header({ text, size = "md", className }: HeaderType) {
  return (
    <h1 className={`${defaultStyles} ${sizes[size]} ${className}`}>{text}</h1>
  );
}
