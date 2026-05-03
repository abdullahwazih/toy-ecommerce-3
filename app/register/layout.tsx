export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-theme="dark"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-auto px-4 py-10 text-white bg-gradient-to-b from-slate-950 via-slate-950 to-emerald-950/60"
    >
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-500 blur-3xl" />
        <div className="absolute -bottom-24 left-10 h-64 w-64 rounded-full bg-indigo-500 blur-3xl" />
        <div className="absolute -bottom-24 right-10 h-64 w-64 rounded-full bg-fuchsia-500 blur-3xl" />
      </div>
      {children}
    </div>
  );
}
