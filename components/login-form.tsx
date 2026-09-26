import { loginAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  error,
  devPassword,
}: {
  error: string | null;
  devPassword: string | null;
}) {
  return (
    <form action={loginAction} className="paper mx-auto w-full max-w-md space-y-5 p-6 sm:p-8">
      <div>
        <p className="text-sm tracking-[0.16em] text-[#8d6b2f] uppercase">Editors</p>
        <h1 className="mt-2 font-serif text-4xl">Review queue</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Submissions stay private until an editor approves them. Import a full word list from this
          same desk.
        </p>
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
      {devPassword ? (
        <p className="text-sm leading-6 text-muted-foreground">
          This local server accepts the default password{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5">{devPassword}</code>. Set{" "}
          <code className="rounded bg-secondary px-1.5 py-0.5">ADMIN_PASSWORD</code> before
          deploying.
        </p>
      ) : null}
      <Button type="submit" className="h-11 px-5">
        Enter
      </Button>
    </form>
  );
}
