"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

const links = [
  { label: "Blog", href: "/blog" },
  { label: "Projects", href: "#projects" },
  { label: "Practice", href: "#practice" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const getHref = (href: string) => (href.startsWith("#") && pathname !== "/" ? `/${href}` : href);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="site-header">
      <nav className="nav" aria-label="Primary navigation">
        <a className="wordmark" href={pathname === "/" ? "#top" : "/#top"} onClick={() => setOpen(false)}>
          <span aria-hidden="true">LM</span>
          <span>Laurent Maxhuni</span>
        </a>
        <button
          className="menu-button"
          type="button"
          aria-expanded={open}
          aria-controls="primary-nav-links"
          onClick={() => setOpen((value) => !value)}
        >
          <span>{open ? "Close" : "Menu"}</span>
          {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={20} />}
        </button>
        <div id="primary-nav-links" className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {links.map((link) => (
            <a
              key={link.href}
              href={getHref(link.href)}
              aria-current={link.href === "/blog" && pathname.startsWith("/blog") ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
