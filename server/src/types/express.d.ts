import type { SessionUser } from "@/types/session-user";

declare global {
  namespace Express {
    interface Request {
      user?: SessionUser;
      /** Set by `checkSchema` middleware after a successful parse. */
      validated?: unknown;
    }
  }
}

export {};
