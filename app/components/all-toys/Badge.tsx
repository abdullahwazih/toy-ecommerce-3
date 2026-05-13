// /components/ui/Badge.tsx
type BadgeProps = {
  label: string;
};

export default function Badge({ label }: BadgeProps) {
  return (
    <span className="inline-block bg-indigo-50 text-indigo-700 text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full">
      {label}
    </span>
  );
}