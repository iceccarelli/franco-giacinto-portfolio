"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { company } from "@/data/company";

export function HomeHero() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mq.matches) video.pause();
      else void video.play();
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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
            poster="/images/stair-studio.jpg"
            aria-label="Custom white oak staircase in a Toronto home"
          >
            <source src="/videos/stairs-hero.mp4" type="video/mp4" />
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
