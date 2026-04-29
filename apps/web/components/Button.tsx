interface IButton {
  text: string;
  isPending?: boolean;
  onSubmit?: () => void;
}

export default function Button({ text, isPending = false, onSubmit }: IButton) {
  return (
    <button
      onSubmit={onSubmit}
      disabled={isPending}
      className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-600"
    >
      {text}
    </button>
  );
}
