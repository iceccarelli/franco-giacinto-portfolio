import { NextResponse, type NextRequest } from "next/server";
import { hostPolicy, isCorsPublicPath } from "@/lib/canonical-host";

/**
 * Request-time host and CORS guard. Stage 1 of the discoverability program.
 *
 * Two config-level layers already exist — meta robots noindex when
 * VERCEL_ENV=preview (lib/site-url.ts) and a host-matched X-Robots-Tag for
 * *.vercel.app hosts (next.config.mjs). This middleware is the third and
 * widest: it sees the actual Host header of every HTML request, so it also
 * covers hosts the other two cannot know about in advance (a stapled domain,
 * a mirror, a future alias), and it owns the www → apex 308.
 *
 * It also owns the CORS boundary, because production was measured sending
 * `Access-Control-Allow-Origin: *` on HTML from a Vercel dashboard setting
 * that exists in no file here. See lib/canonical-host.ts.
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

  const response = NextResponse.next();

  if (policy.action === "noindex") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  /**
   * Strip the wildcard from everything that is not a deliberate agent
   * endpoint. `delete` rather than `set`: a marketing page has no business
   * carrying any CORS header at all, and setting one to a narrower origin
   * would still advertise that a policy exists.
   */
  if (!isCorsPublicPath(request.nextUrl.pathname)) {
    response.headers.delete("Access-Control-Allow-Origin");
    response.headers.delete("Access-Control-Allow-Methods");
    response.headers.delete("Access-Control-Allow-Headers");
  }

  return response;
}

export const config = {
  /**
   * Skip Next's own static payloads and the immutable media folders — they
   * inherit the host-level X-Robots-Tag from next.config.mjs where it
   * matters, and running middleware on every chunk request buys nothing.
   */
  matcher: ["/((?!_next/static|_next/image|images/|videos/|favicon.svg).*)"],
};
