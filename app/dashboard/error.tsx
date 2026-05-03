"use client";

import { Button, ButtonLink, Card } from "../components/ui";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="mx-auto max-w-lg p-6">
      <h1 className="text-lg font-semibold text-zinc-950 dark:text-white">
        Couldn’t load your dashboard
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-white/70">
        {error.message || "Something went wrong."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button onClick={reset} variant="secondary">
          Try again
        </Button>
        <ButtonLink href="/">Go home</ButtonLink>
      </div>
    </Card>
  );
}
