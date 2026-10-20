import { useRef, useEffect, type CSSProperties } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import { BookOpen, MapPin, Sparkles } from "lucide-react";

function Building({
  x,
  y,
  w,
  h,
  height,
  tower = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  height: number;
  tower?: boolean;
}) {
  const dx = height * 0.44,
    dy = -height * 0.8;
  return (
    <g>
      <path
        d={`M${x} ${y} l${w} ${-w * 0.43} ${h} ${h * 0.5} ${-w} ${w * 0.43}Z`}
        fill="#c6c1b6"
        opacity=".4"
        transform="translate(4 10)"
      />
      <path
        d={`M${x} ${y} l${dx} ${dy} ${w} ${-w * 0.43} ${-dx} ${-dy}Z`}
        fill="#c6bdb1"
      />
      <path
        d={`M${x + w} ${y - w * 0.43} l${dx} ${dy} ${h} ${h * 0.5} ${-dx} ${-dy}Z`}
        fill="#aaa094"
      />
      <path
        d={`M${x} ${y} l${w} ${-w * 0.43} ${h} ${h * 0.5} ${-w} ${w * 0.43}Z`}
        fill="#c4b8a9"
      />
      <path
        d={`M${x} ${y} l${dx} ${dy} ${h} ${h * 0.5} ${-dx} ${-dy}Z`}
        fill="#e6dfd4"
      />
      <path
        d={`M${x + h} ${y + h * 0.5} l${dx} ${dy} ${w} ${-w * 0.43} ${-dx} ${-dy}Z`}
        fill="#b8ad9f"
      />
      <path
        d={`M${x + dx} ${y + dy} l${w} ${-w * 0.43} ${h} ${h * 0.5} ${-w} ${w * 0.43}Z`}
        fill={tower ? "#74677d" : "#d4ccc0"}
        stroke="#f1ece3"
        strokeWidth="1.5"
      />
      {Array.from({ length: Math.floor(w / 14) }, (_, i) => (
        <path
          key={i}
          d={`M${x + h + 10 + i * 13 + dx * 0.3} ${y + h * 0.5 - (10 + i * 13) * 0.43 + dy * 0.3} l${dx * 0.3} ${dy * 0.3} 4 -2 ${-dx * 0.3} ${-dy * 0.3}Z`}
          fill="#807480"
        />
      ))}
      {tower && (
        <>
          <path
            d={`M${x + dx + 8} ${y + dy + 1} l18 -32 20 16 -18 28Z`}
            fill="#60516c"
          />
          <path
            d={`M${x + dx + 8} ${y + dy + 1} l18 -32 -2 39Z`}
            fill="#887790"
          />
        </>
      )}
    </g>
  );
}

export function CampusScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    let visible = true;
    const update = () => {
      el.dataset.paused = String(!visible || document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  const reduced = useReducedMotion();
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 80, damping: 24 }),
    rotateY = useSpring(y, { stiffness: 80, damping: 24 });
  return (
    <div
      ref={sceneRef}
      className="campus-scene"
      onPointerMove={(e) => {
        if (reduced || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientY - r.top - r.height / 2) / 90);
        y.set((e.clientX - r.left - r.width / 2) / 90);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      <div className="scene-orbit orbit-one" />
      <div className="scene-orbit orbit-two" />
      <span className="scene-coordinate">40°49′ N &nbsp; 73°57′ W · CCNY</span>
      <motion.div className="scene-perspective" style={{ rotateX, rotateY }}>
        <svg
          viewBox="0 0 600 490"
          role="img"
          aria-label="Illustrative three-dimensional campus architectural model, not a geographic map"
        >
          <defs>
            <filter id="shadow">
              <feGaussianBlur stdDeviation="16" />
            </filter>
            <linearGradient id="base" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#eee9df" />
              <stop offset="1" stopColor="#d6cebf" />
            </linearGradient>
            <pattern
              id="lawn"
              width="5"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <rect width="5" height="5" fill="#b7c3ab" />
              <circle cx="2" cy="2" r=".6" fill="#a8b69d" />
            </pattern>
          </defs>
          <ellipse
            cx="310"
            cy="393"
            rx="220"
            ry="40"
            fill="#534436"
            opacity=".16"
            filter="url(#shadow)"
          />
          <g className="floating-model">
            <path d="M52 275 330 148 558 276 280 420 52 295Z" fill="#c8bfaf" />
            <path
              d="m52 275 278-127 228 128-278 129Z"
              fill="url(#base)"
              stroke="#f9f6ef"
              strokeWidth="3"
            />
            <path
              d="m140 279 193-87 135 78-190 94Z"
              fill="url(#lawn)"
              stroke="#e8e3d7"
              strokeWidth="8"
            />
            <path
              d="m100 292 205-97m-53 188 239-116m-293-16 201 116m-107-154 207 115"
              stroke="#f6f1e8"
              strokeWidth="10"
            />
            <path
              d="m173 291 81-37 83 45 77-36"
              fill="none"
              stroke="#9874b6"
              strokeWidth="2"
              strokeDasharray="5 5"
            />
            <Building x={119} y={267} w={100} h={31} height={53} />
            <Building x={318} y={226} w={101} h={42} height={64} />
            <Building x={343} y={330} w={107} h={33} height={42} />
            <Building x={213} y={340} w={73} h={35} height={57} />
            <Building x={235} y={246} w={34} h={30} height={97} tower />
            <Building x={444} y={284} w={35} h={26} height={58} tower />
            {[
              [139, 309],
              [184, 330],
              [293, 222],
              [486, 302],
              [330, 365],
              [401, 247],
            ].map(([cx, cy], i) => (
              <g key={i}>
                <path d={`M${cx} ${cy}v-18`} stroke="#928772" strokeWidth="3" />
                <ellipse
                  cx={cx}
                  cy={cy - 22}
                  rx="10"
                  ry="15"
                  fill={i % 2 ? "#8c9d80" : "#a5b294"}
                />
                <ellipse
                  cx={cx - 3}
                  cy={cy - 26}
                  rx="6"
                  ry="10"
                  fill="#bdc8aa"
                />
              </g>
            ))}
            <g className="model-pin">
              <ellipse
                cx="281"
                cy="278"
                rx="22"
                ry="10"
                fill="#603c91"
                opacity=".12"
              />
              <path d="M281 266c-30-32-18-57 0-57s30 25 0 57Z" fill="#603c91" />
              <circle cx="281" cy="228" r="7" fill="#faf7ff" />
            </g>
            <g className="model-pin second-pin">
              <path d="M420 233c-22-25-14-44 0-44s22 19 0 44Z" fill="#8e73a5" />
              <circle cx="420" cy="204" r="5" fill="white" />
            </g>
          </g>
        </svg>
        <div className="scene-label label-writing">
          <span className="scene-icon">
            <BookOpen size={17} />
          </span>
          <div>
            <strong>A little support.</strong>
            <small>A whole lot of possibility.</small>
          </div>
          <Sparkles size={14} />
        </div>
        <div className="scene-label label-campus">
          <MapPin size={15} />
          <span>Your next stop is closer than you think.</span>
        </div>
      </motion.div>
      <span className="scene-caption">
        A new perspective on your everyday.{" "}
        <span>Illustrative campus model</span>
      </span>
    </div>
  );
}

export function AmbientParticles() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let visible = true;
    const update = () => {
      el.dataset.paused = String(!visible || document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);
  return (
    <div ref={ref} className="ambient" aria-hidden="true">
      {Array.from({ length: 24 }, (_, i) => (
        <i
          key={i}
          style={
            {
              left: `${(i * 37 + 13) % 100}%`,
              top: `${(i * 23 + 7) % 100}%`,
              "--delay": `${-i * 1.7}s`,
              "--duration": `${12 + (i % 7) * 3}s`,
              width: `${2 + (i % 3)}px`,
              height: `${2 + (i % 3)}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
