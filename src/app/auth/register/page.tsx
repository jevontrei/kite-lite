import { RegisterForm } from "@/components/register-form";
import { SignInOauthButton } from "@/components/sign-in-oauth-button";
import { ReturnButton } from "@/components/ui/return-button";
import Link from "next/link";

export default function Page() {
  return (
    <div className="px-8 py-8 container mx-auto max-w-md space-y-8">
      <div className="space-y-8">
        <ReturnButton href="/" label="Home" />

        <h1 className="text-3xl font-bold">Register</h1>
      </div>

      <div className="space-y-4">
        <RegisterForm />

        <p className="text-muted-foreground text-sm">
          <Link href="/auth/login" className="hover:text-foreground">
            Already have an account? Login
          </Link>
        </p>

        <p>
          <Link
            href="/weather-forecast"
            className="text-muted-foreground text-sm hover:text-foreground"
          >
            Continue as a guest
          </Link>
        </p>

        <hr className="max-w-sm" />
      </div>

      <div className="flex flex-col max-w-sm gap-4">
        <SignInOauthButton signUp provider="google" />
        <SignInOauthButton signUp provider="github" />
      </div>
    </div>
  );
}
