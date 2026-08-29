"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * A print button that prints.
 *
 * This was an <a href="#print"> with the keyboard shortcut written beside it —
 * a control that looks like a button, is labelled "Print the card", and does
 * nothing when clicked. The keyboard hint does not rescue it: the failure is
 * that the affordance lies.
 *
 * It is the only client component on this page, and it is about forty bytes of
 * behaviour, which is the right trade for a control that has to work.
 */
export function PrintButton() {
  return (
    <Button variant="outline" onClick={() => window.print()}>
      <Printer className="size-4" aria-hidden />
      Print the card
    </Button>
  );
}
