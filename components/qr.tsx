import QRCode from "qrcode";

/**
 * A QR code, rendered to inline SVG on the server.
 *
 * No client JavaScript and no image request: the whole code is about 1.5 KB of
 * path data in the HTML, which is smaller than the HTTP request that would
 * fetch a PNG of it. It also means the code is present for anyone who prints
 * the page, which is the point — a business card whose QR only appears after
 * JavaScript runs is not a business card.
 *
 * Error correction level M tolerates roughly 15% damage, which is the right
 * trade for something that will be photographed off a screen at an angle or
 * printed small.
 */
export async function QR({
  value,
  className,
  title,
}: {
  value: string;
  className?: string;
  title: string;
}) {
  const svg = await QRCode.toString(value, {
    type: "svg",
    margin: 0,
    errorCorrectionLevel: "M",
    color: { dark: "#1b3a2a", light: "#0000" },
  });

  // qrcode emits its own width/height; strip them so the SVG scales to its box.
  const scalable = svg
    .replace(/ (width|height)="[^"]*"/g, "")
    .replace("<svg ", `<svg role="img" aria-label="${title}" `);

  return <span className={className} dangerouslySetInnerHTML={{ __html: scalable }} />;
}
