import Link from "next/link";
import { resetPasswordAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetForm({ error }: { error: string | null }) {
  return (
    <form action={resetPasswordAction} className="paper mx-auto w-full max-w-md space-y-5 p-6 sm:p-8">
      <div>
        <h1 className="font-serif text-4xl">New password</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Enter the recovery code that was shown once, when the password was created or last
          replaced. A new recovery code is shown after this, and the previous code stops working.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="recovery">Recovery code</Label>
        <Input
          id="recovery"
          name="recovery"
          type="text"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          required
          className="h-11 font-mono tracking-widest md:text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="h-11 md:text-base"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <Input
          id="confirm"
          name="confirm"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          className="h-11 md:text-base"
        />
      </div>
      {error ? (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" className="h-11 px-5">
          Set new password
        </Button>
        <Link href="/admin" className="text-sm underline decoration-[#c6a15a] underline-offset-4">
          Back
        </Link>
      </div>
    </form>
  );
}
