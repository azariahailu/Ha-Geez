import { loginAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  error,
}: {
  error: string | null;
  devPassword?: string | null;
}) {
  return (
    <form action={loginAction} className="paper mx-auto w-full max-w-md space-y-5 p-6 sm:p-8">
      <div>
        <h1 className="font-serif text-4xl">Password</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">A password is required.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 md:text-base"
        />
      </div>
      {error ? (
        <p className="text-sm text-primary" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="h-11 px-5">
        Enter
      </Button>
    </form>
  );
}
