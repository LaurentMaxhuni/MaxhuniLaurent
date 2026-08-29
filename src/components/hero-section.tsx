import { ArrowDown, ArrowUpRight } from "lucide-react";
import BlackHoleHeroSection from "@/components/blackhole-hero-section";
import { PERSON } from "@/lib/site";

export default function HeroSection() {
  return (
    <section id="top" className="hero hero--black-hole" aria-labelledby="hero-title">
      <BlackHoleHeroSection
        aria-hidden="true"
        className="hero__black-hole"
        focus={[0.74, 0.48]}
        scrim="left"
        scrimStrength={0.92}
        starBrightness={0.16}
        brightness={0.8}
        glow={0}
        steps={240}
        resolution={0.62}
      />
      <div className="shell hero__layout">
        <div className="hero__copy">
          <h1 id="hero-title">Ideas deserve their own orbit.</h1>
          <p>
            I&apos;m {PERSON.name}, a {PERSON.role} from {PERSON.location}. I build {PERSON.work}.
          </p>
          <div className="hero__actions">
            <a className="blue-button" href="#projects">
              See the work <ArrowDown aria-hidden="true" size={18} />
            </a>
            <a className="hero__link" href="#contact">
              Get in touch <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
