import { NEXTAUTH } from "../../../lib/auth";
import NextAuth from "next-auth/next";
const handler = NextAuth(NEXTAUTH)
export const GET = handler;
export const POST = handler;

