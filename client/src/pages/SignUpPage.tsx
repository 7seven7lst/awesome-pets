import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthForm, type SignupFormValues } from "../components/auth/AuthForm";
import { AuthPageHeader } from "../components/auth/AuthPageHeader";
import { AuthPageShell } from "../components/auth/AuthPageShell";
import { ROUTES } from "../lib/routes";
import { link } from "../lib/ui-styles";

export function SignUpPage() {
  const { signUp, user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate(ROUTES.dashboard, { replace: true });
    }
  }, [loading, user, navigate]);

  async function handleAuthSubmit(values: SignupFormValues) {
    const name = values.name?.trim() ?? "";
    await signUp(name, values.email.trim(), values.password);
    navigate(ROUTES.dashboard, { replace: true });
  }

  return (
    <AuthPageShell loading={loading}>
      <AuthPageHeader
        title="Sign up"
        subtitle={
          <>
            Already have an account?{" "}
            <Link to={ROUTES.signIn} className={link}>Sign in</Link>
          </>
        }
      />
      <AuthForm mode="sign-up" onSubmit={handleAuthSubmit} />
    </AuthPageShell>
  );
}
