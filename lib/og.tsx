import { ImageResponse } from "next/og";
import { company } from "@/data/company";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

/**
 * One Open Graph card renderer for the whole site.
 *
 * Social previews and, increasingly, answer-engine result cards are the first
 * impression of a page. Generating them from the page's own title means they can
 * never drift out of sync with the content the way a hand-made JPEG does.
 *
 * Rendered with the Satori subset of CSS: flexbox only, no gap on some versions,
 * no external assets. Colours are literals because CSS custom properties are not
 * resolved here.
 */
export function renderOgImage({
  kicker,
  title,
  meta,
}: {
  kicker: string;
  title: string;
  meta?: string;
}) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#1b3a2a",
        color: "#f3eee6",
        padding: "72px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            backgroundColor: "#f3eee6",
            color: "#1b3a2a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          GH
        </div>
        <div
          style={{
            marginLeft: 16,
            fontSize: 26,
            letterSpacing: -0.5,
          }}
        >
          Green Hardwood
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 20,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#a8c4b3",
            marginBottom: 20,
          }}
        >
          {kicker}
        </div>
        <div
          style={{
            fontSize: title.length > 60 ? 60 : 74,
            lineHeight: 1.05,
            letterSpacing: -2,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 24,
          color: "#a8c4b3",
          borderTop: "1px solid rgba(243,238,230,0.18)",
          paddingTop: 28,
        }}
      >
        <div>{meta ?? "Hardwood floors · Stairs · Railings"}</div>
        <div>{company.phoneDisplay}</div>
      </div>
    </div>,
    OG_SIZE,
  );
}
