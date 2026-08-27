import Link from "next/link";
import { Phone } from "lucide-react";
import { company } from "@/data/company";

export function MobileCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2">
        <a
          href={`tel:${company.phone}`}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-border bg-surface text-sm font-medium"
        >
          <Phone className="size-4" />
          Call
        </a>
        <Link
          href="/estimate"
          className="inline-flex h-12 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-fg"
        >
          Free estimate
        </Link>
      </div>
    </div>
  );
}
