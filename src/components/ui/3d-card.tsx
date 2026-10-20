import { useRef, type ReactNode } from "react";
import { useReducedMotion } from "motion/react";
// Selective adaptation of Aceternity UI's CardContainer / CardBody / CardItem
// perspective pattern: https://ui.aceternity.com/components/3d-card-effect
// Use direct transforms to avoid rendering React state on every pointer movement.
export function CardContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  return (
    <div
      className={`tilt-container ${className}`}
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse" || !ref.current) return;
        const r = e.currentTarget.getBoundingClientRect();
        ref.current.style.transform = `rotateY(${(e.clientX - r.left - r.width / 2) / 65}deg) rotateX(${-(e.clientY - r.top - r.height / 2) / 65}deg)`;
      }}
      onPointerLeave={() => {
        if (ref.current)
          ref.current.style.transform = "rotateY(0deg) rotateX(0deg)";
      }}
    >
      <div ref={ref} className="tilt-body">
        {children}
      </div>
    </div>
  );
}
