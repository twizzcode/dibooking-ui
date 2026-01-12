"use client";

import { GalleryVerticalEnd } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
} from "@/components/ui/field"
import { authClient } from "@/lib/auth-client"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/explore",
      });
    } catch (error) {
      console.error("Error signing in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={(e) => e.preventDefault()}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Dibooking.id</span>
            </a>
            <h1 className="text-xl font-bold">Selamat Datang di Dibooking.id</h1>
            <FieldDescription>
              Masuk untuk mengelola booking Anda
            </FieldDescription>
          </div>
          <Field className="grid gap-4 sm:grid-cols-1">
            <Button 
              variant="outline" 
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Masuk dengan Google
                </>
              )}
            </Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Dengan melanjutkan, Anda menyetujui <a href="#">Syarat Layanan</a>{" "}
        dan <a href="#">Kebijakan Privasi</a> kami.
      </FieldDescription>
    </div>
  )
}
