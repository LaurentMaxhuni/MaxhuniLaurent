import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <p>© 2026 Laurent Maxhuni</p>
        <p>
          <Link href="/about">About</Link> · <Link href="/contact">Contact</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/developers">Developer resources</Link>
        </p>
      </div>
    </footer>
  );
}
