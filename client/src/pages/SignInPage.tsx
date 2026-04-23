import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { AuthForm, type SignupFormValues } from "../components/auth/AuthForm";
import { AuthPageHeader } from "../components/auth/AuthPageHeader";
import { AuthPageShell } from "../components/auth/AuthPageShell";
import { ROUTES } from "../lib/routes";
import { link } from "../lib/ui-styles";

export function SignInPage() {
  const { signIn, user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? ROUTES.dashboard;

  useEffect(() => {
    if (!loading && user) {
      navigate(from, { replace: true });
    }
  }, [loading, user, navigate, from]);

  async function handleAuthSubmit(values: SignupFormValues) {
    await signIn(values.email.trim(), values.password);
    navigate(from, { replace: true });
  }

  return (
    <AuthPageShell loading={loading}>
      <AuthPageHeader
        title="Sign in"
        subtitle={
          <>
            New here?{" "}
            <Link to={ROUTES.signUp} className={link}>Create an account</Link>
          </>
        }
      />
      <AuthForm mode="sign-in" onSubmit={handleAuthSubmit} />
    </AuthPageShell>
  );
}
