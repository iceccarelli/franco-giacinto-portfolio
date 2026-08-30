import { NextResponse, type NextRequest } from "next/server";
import { hostPolicy } from "@/lib/canonical-host";

/**
 * Request-time host guard. Stage 1 of the discoverability program.
 *
 * Two config-level layers already exist — meta robots noindex when
 * VERCEL_ENV=preview (lib/site-url.ts) and a host-matched X-Robots-Tag for
 * *.vercel.app hosts (next.config.mjs). This middleware is the third and
 * widest: it sees the actual Host header of every HTML request, so it also
 * covers hosts the other two cannot know about in advance (a stapled domain,
 * a mirror, a future alias), and it owns the www → apex 308.
 *
 * Policy logic is pure and lives in lib/canonical-host.ts, where
 * tests/canonical-host.test.ts pins it.
 */
export function middleware(request: NextRequest) {
  const policy = hostPolicy(request.headers.get("host"));

  if (policy.action === "redirect") {
    const url = request.nextUrl.clone();
    url.host = policy.host;
    url.protocol = "https:";
    url.port = "";
    // 308: permanent, method-preserving. The one redirect this site makes.
    return NextResponse.redirect(url, 308);
  }

  if (policy.action === "noindex") {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Skip Next's own static payloads and the immutable media folders — they
   * inherit the host-level X-Robots-Tag from next.config.mjs where it
   * matters, and running middleware on every chunk request buys nothing.
   */
  matcher: ["/((?!_next/static|_next/image|images/|videos/|favicon.svg).*)"],
};
