import Link from "next/link";
import { PERSON } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <p>© {new Date().getFullYear()} {PERSON.name} · {PERSON.role} from {PERSON.location}</p>
        <nav aria-label="Footer navigation">
          <Link href="/about">About</Link> · <Link href="/contact">Contact</Link> · <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
