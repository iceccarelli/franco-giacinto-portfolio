export function PageHero({ kicker, title, lede }: { kicker: string; title: string; lede: string }) {
  return (
    <section className="border-b border-border bg-bg-warm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-medium tracking-[0.18em] text-accent uppercase">{kicker}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.08] font-medium sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{lede}</p>
      </div>
    </section>
  );
}
