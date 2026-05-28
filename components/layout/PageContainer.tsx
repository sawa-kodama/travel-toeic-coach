import { cn } from "@/lib/utils";

export function PageContainer({ children, className }: { children: React.ReactNode; className?: string }) {
  return <section className={cn("space-y-5", className)}>{children}</section>;
}
