import { Children, type CSSProperties, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import "@/components/shadcn-space/orbiting-circles/orbiting-circles-02.css";

export type OrbitingCircles02Ring = {
  children: ReactNode;
  radius: string;
  duration: number;
  reverse?: boolean;
  path?: boolean;
  iconSize?: number;
};

export type OrbitingCircles02Props = HTMLAttributes<HTMLDivElement> & {
  center?: ReactNode;
  rings: OrbitingCircles02Ring[];
};

type RingStyle = CSSProperties & {
  "--orbit-radius": string;
  "--orbit-duration": string;
  "--orbit-icon-size": string;
};

function OrbitingRing({ children, radius, duration, reverse = false, path = true, iconSize = 58, index }: OrbitingCircles02Ring & { index: number }) {
  const items = Children.toArray(children);
  const style: RingStyle = {
    "--orbit-radius": radius,
    "--orbit-duration": `${duration}s`,
    "--orbit-icon-size": `${iconSize}px`,
  };

  return (
    <div
      className={cn(
        "orbiting-circles-02__ring",
        `orbiting-circles-02__ring--${index + 1}`,
        reverse && "orbiting-circles-02__ring--reverse",
      )}
      style={style}
    >
      {path && <span className="orbiting-circles-02__path" aria-hidden="true" />}
      {items.map((child, index) => {
        const angle = (360 / items.length) * index;

        return (
          <div
            key={`orbit-item-${index}`}
            className="orbiting-circles-02__item"
            style={{ "--start-angle": `${angle}deg` } as CSSProperties}
          >
            <div
              className="orbiting-circles-02__counter"
              style={{ "--counter-angle": `${-angle}deg` } as CSSProperties}
            >
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function OrbitingCircles02({ center, rings, className, ...props }: OrbitingCircles02Props) {
  return (
    <div className={cn("orbiting-circles-02", className)} {...props}>
      {center && <div className="orbiting-circles-02__center">{center}</div>}
      {rings.map((ring, index) => <OrbitingRing key={`orbit-ring-${index}`} {...ring} index={index} />)}
    </div>
  );
}
