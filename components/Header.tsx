"use client";
import { useState, useEffect, useCallback } from "react";

const NAV: { label: string; href: string }[] = [
  { label: "About", href: "#about" },
  { label: "Craftsmanship", href: "#architecture" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Tools", href: "#tools" },
  { label: "Intelligence", href: "#live-intelligence" },
  { label: "Impact", href: "#impact" },
  { label: "Experience", href: "#experience" },
  { label: "Certifications", href: "#certifications" },
  { label: "Partners", href: "#partners" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastY, setLastY] = useState(0);

  const onScroll = useCallback(() => {
    const y = window.scrollY;
    setScrolled(y > 40);
    if (y > lastY && y > 200) setHidden(true);
    else setHidden(false);
    setLastY(y);
  }, [lastY]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <header
      className={`site-header${scrolled ? " scrolled" : ""}${hidden ? " header-hidden" : ""}`}
    >
      <div className="header-inner">
        <a href="#" className="header-logo">
          <span className="logo-monogram">FG</span>
          <span className="logo-text">Franco Giacinto</span>
        </a>
        <nav className={`header-nav${menuOpen ? " nav-open" : ""}`}>
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="nav-link"
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </a>
          ))}
          <a href="#contact" className="nav-cta" onClick={() => setMenuOpen(false)}>
            Free Quote
          </a>
        </nav>
        <button
          className={`menu-toggle${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
