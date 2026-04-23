import type { DashboardPart } from "../../api/dashboard";

const errorTextClass = "text-sm text-red-600";

export interface DashboardErrorAlertPartProps<T = unknown> {
  part?: DashboardPart<T>;
  message?: string | null | undefined;
  className?: string;
}


/** Dashboard-style error line: either a failed {@link DashboardPart} or a plain message (e.g. list fetch). */
export function DashboardErrorAlert<T>(props: DashboardErrorAlertPartProps<T>) {
  const className = props.className ?? "";
  const text =
    props.part
      ? props.part.status === "error"
        ? props.part.error
        : null
      : props.message || null;

  if (!text) {
    return null;
  }

  return (
    <p className={[errorTextClass, className].filter(Boolean).join(" ")} role="alert">
      {text}
    </p>
  );
}
