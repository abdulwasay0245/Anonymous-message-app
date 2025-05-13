import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { User } from "@/model/user";



interface Credentials {
    email: string;
    password: string;
  }

export const authOptions: NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async authorize(credentials: any): Promise<any> {
                await dbConnect();
                try {
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.email },
                            { password: credentials.password }
                        ]
                    });

                    if (!user) {
                        throw new Error("Invalid credentials");
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login");
                    }

                    return user; // <-- Important: you must return the user object here
                } catch (error: any) {
                    throw new Error(error.message || "Login failed");
                }
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.isAcceptingMessage = user.isAcceptingMessage;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user._id = token._id as string;
                session.user.isVerified = token.isVerified as boolean;
                session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
                session.user.username = token.username as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/sign-in',
    },
    session: {
        strategy: 'jwt'
    },
    secret: process.env.NEXTAUTH_SECRET,
};
