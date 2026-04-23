import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PrivateRoute } from "./auth/PrivateRoute";
import { Layout } from "./components/Layout";
import { SpinnerWithLabel } from "./components/Spinner";
import { PATHS } from "./lib/routes";
import { page } from "./lib/ui-styles";

const DashboardPage = lazy(() =>
  import("./pages/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const AddMedicalRecordPage = lazy(() =>
  import("./pages/AddMedicalRecordPage").then((m) => ({ default: m.AddMedicalRecordPage })),
);
const PetDetailPage = lazy(() =>
  import("./pages/PetDetailPage").then((m) => ({ default: m.PetDetailPage })),
);
const PetFormPage = lazy(() =>
  import("./pages/PetFormPage").then((m) => ({ default: m.PetFormPage })),
);
const PetListPage = lazy(() =>
  import("./pages/PetListPage").then((m) => ({ default: m.PetListPage })),
);
const SignInPage = lazy(() =>
  import("./pages/SignInPage").then((m) => ({ default: m.SignInPage })),
);
const SignUpPage = lazy(() =>
  import("./pages/SignUpPage").then((m) => ({ default: m.SignUpPage })),
);

function PageFallback() {
  return (
    <div className={`flex min-h-screen items-center justify-center bg-zinc-50 ${page}`}>
      <SpinnerWithLabel message="Loading page…" />
    </div>
  );
}

export function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path={PATHS.signIn} element={<SignInPage />} />
        <Route path={PATHS.signUp} element={<SignUpPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path={PATHS.dashboard} element={<DashboardPage />} />
            <Route path={PATHS.petList} element={<PetListPage />} />
            <Route path={PATHS.petNew} element={<PetFormPage mode="create" />} />
            <Route path={PATHS.petRecordNew} element={<AddMedicalRecordPage />} />
            <Route path={PATHS.petDetail} element={<PetDetailPage />} />
            <Route path={PATHS.petEdit} element={<PetFormPage mode="edit" />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to={PATHS.dashboard} replace />} />
      </Routes>
    </Suspense>
  );
}
