import { motion } from "framer-motion";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-gray-200 dark:bg-gray-800 animate-pulse rounded ${className}`} />
  );
}

export function HotelSkeleton() {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl overflow-hidden border border-[var(--border)] flex flex-col h-[400px]">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="p-5 space-y-4 flex flex-col flex-1">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-[var(--border)]">
          <div className="space-y-1">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function DestinationSkeleton() {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-3xl overflow-hidden border border-[var(--border)] h-[420px]">
      <Skeleton className="h-56 w-full rounded-none" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-12 w-full" />
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
    </div>
  );
}
