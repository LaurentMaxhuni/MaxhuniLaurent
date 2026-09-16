import Link from "next/link";
import { PERSON } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <p>© 2026 {PERSON.name} · {PERSON.role} from {PERSON.location}</p>
        <p>
          <Link href="/about">About</Link> · <Link href="/contact">Contact</Link> · <Link href="/privacy">Privacy</Link> · <Link href="/developers">Developer resources</Link>
        </p>
      </div>
    </footer>
  );
}
