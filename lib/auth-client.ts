import { createAuthClient } from "better-auth/client";
import { redirect } from "next/navigation";
import { adminClient } from "better-auth/client/plugins"

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL as string,
  plugins: [
        adminClient()
    ]
});

const signIn = async () => {
  await authClient.signIn.social({
    provider: "google",
    callbackURL: "/",
    errorCallbackURL: "/error",
  });
};

const signOut = async () => {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        redirect("/login");
      },
    },
  });
};

export { signIn, authClient, signOut };
