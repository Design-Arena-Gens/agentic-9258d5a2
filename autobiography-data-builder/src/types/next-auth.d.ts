import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user?: DefaultSession["user"] & {
      id: string;
      role: "user" | "admin";
    };
  }

  interface User {
    role?: "user" | "admin";
  }
  interface DefaultUser {
    role?: "user" | "admin";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
