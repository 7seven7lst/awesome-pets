import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SpinnerWithLabel } from "../components/Spinner";
import { ROUTES } from "../lib/routes";
import { page } from "../lib/ui-styles";
import { useAuth } from "./AuthContext";

export function PrivateRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center bg-zinc-50 ${page}`}>
        <SpinnerWithLabel message="Checking session…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.signIn} replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
