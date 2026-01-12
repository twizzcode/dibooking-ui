import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { admin } from "better-auth/plugins";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "USER",
                input: false,
            },
        },
    },
    databaseHooks: {
        user: {
            create: {
                before: async (user) => {
                    // Transform lowercase role to uppercase for Prisma enum compatibility
                    if (user.role) {
                        user.role = user.role.toUpperCase();
                    } else {
                        user.role = "USER";
                    }
                    return { data: user };
                },
            },
        },
    },
    socialProviders: {
        google: { 
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    plugins: [
        admin() 
    ]
});