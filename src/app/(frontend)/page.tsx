import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import { AboutSection, ContactSection, PracticeSection, ProjectsSection } from "@/components/sections";

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#projects">Skip to projects</a>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <PracticeSection />
        <AboutSection />
        <ContactSection />
      </main>
      <footer className="site-footer">
        <div className="shell">
          <p>© 2026 Laurent Maxhuni</p>
          <p>
            Built with <a href="https://reactbits.dev" target="_blank" rel="noreferrer">React Bits</a>, <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer">shadcn/ui</a>, and <a href="https://skiper-ui.com" target="_blank" rel="noreferrer">Skiper UI</a>.
          </p>
        </div>
      </footer>
    </>
  );
}
