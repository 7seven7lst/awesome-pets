/**
 * Centralised route definitions.
 * - PATHS: React Router pattern strings for <Route path=...>
 * - ROUTES: Concrete URL builders for <Link to=...> and navigate()
 */
export const PATHS = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/",
  petList: "/pets",
  petNew: "/pets/new",
  petDetail: "/pets/:id",
  petRecordNew: "/pets/:id/records/new",
  petEdit: "/pets/:id/edit",
} as const;

export const ROUTES = {
  signIn: "/sign-in",
  signUp: "/sign-up",
  dashboard: "/",
  petList: "/pets",
  petNew: "/pets/new",
  petDetail: (id: string) => `/pets/${id}`,
  petRecordNew: (id: string) => `/pets/${id}/records/new`,
  petEdit: (id: string) => `/pets/${id}/edit`,
} as const;
