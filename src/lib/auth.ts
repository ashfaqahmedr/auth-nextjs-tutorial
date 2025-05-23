import { v4 as uuid } from "uuid";
import { encode as defaultEncode } from "next-auth/jwt";

import db from "@/lib/db/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { SignInSchema } from "@/lib/schema";

const adapter = PrismaAdapter(db);

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter,
  providers: [
    GitHub,
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      
      authorize: async (credentials) => {

        const { username, password } = await SignInSchema.parseAsync(credentials)

          const user = await db.user.findUnique({
            where: { username: username,
                password: password
            },
          })

          // if (!user) return null

          // const isValid = await bcrypt.compare(password, user.password)
          // if (!isValid) return null


        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return {
          id: user.id,
          name: user.fullName,
          username: user.username,
          userType: user.userType, // Add userType to session
        };
 
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token.sub) {
          throw new Error("No user ID found in token");
        }

        const createdSession = await adapter?.createSession?.({
          sessionToken: sessionToken,
          userId: params.token.sub,
          
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        if (!createdSession) {
          throw new Error("Failed to create session");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
   secret: process.env.AUTH_SECRET,
});
