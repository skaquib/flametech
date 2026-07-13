import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
      <p className="text-slate-500 dark:text-slate-400 text-xs">Loading dashboard...</p>
    </div>
  );
}
