import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { toast } from "react-toastify";
import { signInSchema, signUpSchema } from "@novellia/shared/schema/auth";
import { FieldError } from "../../lib/field-error";
import { apiError } from "../../lib/apiError";
import { banner, btnPrimaryBlock, card, field, label, muted, stack } from "../../lib/ui-styles";

export type AuthFormMode = "sign-in" | "sign-up";

export type SignupFormValues = {
  name?: string;
  email: string;
  password: string;
};

type FieldConfig = {
  key: keyof SignupFormValues;
  label: string;
  inputType: "text" | "email" | "password";
  placeholder?: string;
  maxLength?: number;
  autoComplete: (m: AuthFormMode) => string;
  visible: (m: AuthFormMode) => boolean;
};

const AUTH_FIELDS: FieldConfig[] = [
  {
    key: "name",
    label: "Name",
    inputType: "text",
    placeholder: "e.g. Jane Doe",
    maxLength: 100,
    autoComplete: () => "name",
    visible: (m) => m === "sign-up",
  },
  {
    key: "email",
    label: "Email",
    inputType: "email",
    placeholder: "you@example.com",
    autoComplete: () => "email",
    visible: () => true,
  },
  {
    key: "password",
    label: "Password",
    inputType: "password",
    autoComplete: (m) => (m === "sign-in" ? "current-password" : "new-password"),
    visible: () => true,
  },
];

export type AuthFormProps = {
  mode: AuthFormMode;
  onSubmit: (values: SignupFormValues) => Promise<void>;
};

export function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const resolver = useMemo(
    () =>
      zodResolver(mode === "sign-up" ? signUpSchema : signInSchema) as unknown as Resolver<SignupFormValues>,
    [mode],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver,
    defaultValues:
      mode === "sign-up"
        ? { name: "", email: "", password: "" }
        : { email: "", password: "" },
  });

  const visibleFields = AUTH_FIELDS.filter((f) => f.visible(mode));
  const submitLabel = mode === "sign-in" ? "Sign in" : "Create account";
  const submittingLabel = mode === "sign-in" ? "Signing in…" : "Creating account…";

  async function onValid(values: SignupFormValues) {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      const message = apiError(err);
      setSubmitError(message);
      toast.error(message);
    }
  }

  return (
    <>
      {submitError ? <div className={`${banner} mt-4`}>{submitError}</div> : null}

      <form className={`${card} ${stack} mt-6`} onSubmit={handleSubmit(onValid)} noValidate>
        {visibleFields.map((f) => (
          <label key={f.key} className={label}>
            {f.label}
            <input
              className={field}
              type={f.inputType}
              autoComplete={f.autoComplete(mode)}
              placeholder={f.placeholder}
              maxLength={f.maxLength}
              {...register(f.key)}
            />
            <FieldError message={errors[f.key]?.message} />
          </label>
        ))}

        {mode === "sign-up" ? <p className={`${muted} -mt-2`}>At least 8 characters.</p> : null}

        <button className={btnPrimaryBlock} type="submit" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>
    </>
  );
}
