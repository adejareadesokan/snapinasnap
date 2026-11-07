import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function CompactDisclosure({ title, count, children }: { title: string; count: number; children: ReactNode }) {
  return (
    <Collapsible className="rounded-xl border border-border bg-card px-3">
      <CollapsibleTrigger asChild>
        <Button type="button" variant="ghost" className="group tap grid h-auto w-full grid-cols-[minmax(0,1fr)_auto_auto] gap-2 rounded-lg px-0 text-left font-bold shadow-none">
          <span className="min-w-0 whitespace-normal">{title}</span>
          <span className="rounded-full bg-muted px-2 text-xs font-semibold text-muted-foreground">({count})</span>
          <ChevronDown className="shrink-0 transition-transform group-data-[state=open]:rotate-180 motion-reduce:transition-none" aria-hidden />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="pb-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}