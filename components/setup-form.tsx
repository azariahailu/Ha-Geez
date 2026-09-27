import { setupPasswordAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SetupForm({ error }: { error: string | null }) {
  return (
    <form action={setupPasswordAction} className="paper mx-auto w-full max-w-md space-y-5 p-6 sm:p-8">
      <div>
        <h1 className="font-serif text-4xl">Create a password</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Choose a password. It is stored with this dictionary. After it is saved, this form is not
          shown again. A recovery code appears once. Keep that code. It is the way to set a new
          password if this one is forgotten.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
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
      <Button type="submit" className="h-11 px-5">
        Save password
      </Button>
    </form>
  );
}
