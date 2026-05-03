import { Card } from "../components/ui";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-1">
        <h1 className="text-2xl font-semibold text-zinc-950 dark:text-black">
          Customer Dashboard
        </h1>
        <p className="text-sm text-zinc-600 dark:text-white/70">
          Authentication has been removed.
        </p>
      </div>

      <Card className="p-6">
        <div className="grid gap-2">
          <p className="text-sm font-medium text-zinc-950 dark:text-black">
            Status
          </p>
          <p className="text-sm text-zinc-600 dark:text-white/70">
            This page is now public.
          </p>
        </div>
      </Card>
    </div>
  );
}
