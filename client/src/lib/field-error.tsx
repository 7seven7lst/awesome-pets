function toText(message: unknown): string | null {
  if (message == null) return null;
  if (typeof message === "string") return message;
  if (typeof message === "object" && "message" in message && typeof (message as { message: unknown }).message === "string") {
    return (message as { message: string }).message;
  }
  return null;
}

export function FieldError({ message }: { message?: unknown }) {
  const text = toText(message);
  if (!text) return null;
  return <p className="mt-1 text-sm text-red-600">{text}</p>;
}
