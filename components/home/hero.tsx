"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { preload } from "react-dom";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";

type NetworkInfo = { saveData?: boolean; effectiveType?: string };

/**
 * The LCP element of the homepage. 1280×853, progressive JPEG, < 80 KB —
 * generated from stair-studio.jpg (430 KB), which stays for other consumers.
 * A <video poster> can't go through next/image, so the file is pre-optimized
 * on disk and preloaded below instead.
 */
const HERO_POSTER = "/images/stair-studio-poster.jpg";

export function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Emitted as <link rel="preload" as="image"> in the SSR head, so the LCP
  // image download starts with the document instead of after layout.
  preload(HERO_POSTER, { as: "image", fetchPriority: "high" });

  /**
   * The hero loop is 2.7 MB, and it is decoration — the poster frame carries
   * the same information. It used to download for everyone, including the
   * homeowner reading this on LTE in a driveway, which is a large share of the
   * people this page is written for.
   *
   * So the <source> is only mounted once the client has said it is worth it.
   * Server-rendered HTML therefore ships the poster and no video at all, which
   * is also what a crawler gets. Three ways to decline:
   *
   *   - the OS asks for reduced motion
   *   - the browser reports Data Saver on
   *   - the connection reports itself as 2g or slow-3g
   *
   * There is no loading state to design around: the poster is the first frame,
   * so a visitor who never gets the video sees a still photograph rather than
   * a gap.
   */
  const [playVideo, setPlayVideo] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const net = (navigator as Navigator & { connection?: NetworkInfo }).connection;

    const decide = () => {
      const slow =
        net?.saveData === true || (net?.effectiveType ?? "").match(/^(slow-)?2g$/) !== null;
      setPlayVideo(!reduced.matches && !slow);
    };

    decide();
    reduced.addEventListener("change", decide);
    return () => reduced.removeEventListener("change", decide);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playVideo) return;
    void video.play().catch(() => {
      /* Autoplay refused. The poster stands on its own. */
    });
  }, [playVideo]);

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
        <div>
          <p className="text-xs font-medium tracking-[0.2em] text-accent uppercase">
            Toronto · GTA · Southern Ontario
          </p>
          <h1 className="mt-4 font-display text-[2.4rem] leading-[1.05] font-medium sm:text-5xl lg:text-[3.35rem]">
            Hardwood floors. Hardwood stairs. Hardwood railings. One shop.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-muted">
            Green Hardwood is the Toronto company that treats the floor, the stair, and the rail as
            one system. Fifteen years of GTA houses, condos, and estates. No vinyl. No laminate. No
            subcontracted stairs.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/estimate">Get a free estimate</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/stairs">Open the stair studio</Link>
            </Button>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {company.licensed.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check className="size-4 text-accent" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative">
          <video
            ref={videoRef}
            className="aspect-[4/3] w-full rounded-xl object-cover shadow-[var(--shadow-card)] lg:aspect-[5/4]"
            autoPlay
            muted
            loop
            playsInline
            preload={playVideo ? "auto" : "none"}
            poster={HERO_POSTER}
            width={1280}
            height={853}
            aria-label="Custom white oak staircase in a Toronto home"
          >
            {playVideo ? <source src="/videos/stairs-hero.mp4" type="video/mp4" /> : null}
          </video>
          <div className="absolute right-4 bottom-4 left-4 rounded-lg bg-bg/92 p-4 shadow-[var(--shadow-card)] backdrop-blur sm:right-auto sm:max-w-xs">
            <p className="text-xs tracking-[0.16em] text-accent uppercase">On the stair now</p>
            <p className="mt-1 font-display text-xl">White oak box stair, iron balusters</p>
            <p className="text-sm text-muted">
              Matched treads · graspable rail · OBC on the drawing
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
