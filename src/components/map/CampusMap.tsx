import { useState } from "react";
import {
  Compass,
  Minus,
  Plus,
  RotateCcw,
  ArrowUpRight,
  BookOpen,
  PenLine,
  BriefcaseBusiness,
  Heart,
  ShoppingBag,
  Users,
} from "lucide-react";
import type { Resource, Category } from "../../types";
import { Button } from "../ui/button";
export const categoryIcons: Record<Category, typeof BookOpen> = {
  Tutoring: BookOpen,
  Writing: PenLine,
  Careers: BriefcaseBusiness,
  Wellness: Heart,
  "Food & Essentials": ShoppingBag,
  "Student Services": Users,
};
export function CampusMap({
  resources,
  active,
  hovered,
  onSelect,
  onDetail,
}: {
  resources: Resource[];
  active: Resource | undefined;
  hovered: string | null;
  onSelect: (id: string) => void;
  onDetail: (id: string) => void;
}) {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="map-panel">
      <div className="map-heading">
        <span>
          <i />
          Campus, connected.
        </span>
        <span className="map-offline">Offline ready</span>
      </div>
      <div
        className="map-scroll"
        tabIndex={0}
        aria-label="Illustrative campus schematic. Scroll to pan when zoomed; use marker buttons to select resources."
      >
        <div
          className="map-drawing"
          style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}
        >
          <svg
            viewBox="0 0 700 650"
            preserveAspectRatio="none"
            className="map-base"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="map-grid"
                width="24"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M24 0H0V24"
                  fill="none"
                  stroke="#dddcd4"
                  strokeWidth=".5"
                />
              </pattern>
            </defs>
            <rect width="700" height="650" fill="#eceee5" />
            <rect width="700" height="650" fill="url(#map-grid)" />
            <path
              d="M0 85 700 390M0 355 700 660M140 0 0 650M520 0 365 650M700 30 560 650"
              stroke="#fffdf8"
              strokeWidth="36"
            />
            <path
              d="M0 85 700 390M0 355 700 660M140 0 0 650M520 0 365 650M700 30 560 650"
              stroke="#deddd4"
              fill="none"
              strokeWidth="1"
            />
            <path d="M220 180 375 240 340 385 185 323Z" fill="#cdd7be" />
            <path
              d="m245 213 99 40-23 97-103-40Z"
              fill="none"
              stroke="#f6f5ec"
              strokeWidth="5"
            />
            <g fill="#dad7ce" stroke="#f9f7f0" strokeWidth="3">
              <path d="m170 354 112 44-26 115-113-44Z" />
              <path d="m370 104 100 42-20 95-101-40Z" />
              <path d="m464 260 100 43-25 108-100-42Z" />
              <path d="m316 452 79 33-18 80-81-34Z" />
              <path d="m182 91 98 39-12 51-97-38Z" />
            </g>
            <g fill="#b7c7a6">
              {[
                [124, 252],
                [153, 271],
                [177, 280],
                [317, 188],
                [338, 197],
                [363, 208],
                [591, 451],
                [570, 442],
                [537, 530],
                [516, 522],
                [304, 581],
              ].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="9" />
              ))}
            </g>
            <path
              d="m239 356 93-101 184 37"
              fill="none"
              stroke="#9274ae"
              strokeDasharray="5 7"
              strokeWidth="2"
              opacity=".6"
            />
            <g
              fill="#939688"
              fontSize="10"
              fontFamily="Arial"
              letterSpacing="2"
            >
              <text x="190" y="265" transform="rotate(23 190 265)">
                CAMPUS GREEN
              </text>
              <text x="33" y="346" transform="rotate(24 33 346)">
                CAMPUS WALK
              </text>
              <text x="450" y="535" transform="rotate(-76 450 535)">
                COLLEGE WAY
              </text>
            </g>
          </svg>
          {resources.map((r) => {
            const Icon = categoryIcons[r.category];
            return (
              <button
                key={r.id}
                className={`map-marker ${active?.id === r.id || hovered === r.id ? "selected" : ""}`}
                style={{ left: `${r.position[0]}%`, top: `${r.position[1]}%` }}
                onClick={() => onSelect(r.id)}
                aria-label={`Select ${r.name} on schematic`}
                aria-pressed={active?.id === r.id}
              >
                <Icon size={17} />
                <span className="marker-tooltip">{r.name}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="map-tools">
        <span className="map-compass">
          <Compass size={22} />
          <small>N</small>
        </span>
        <div>
          <Button
            variant="outline"
            size="icon"
            aria-label="Zoom in"
            disabled={zoom >= 2}
            onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
          >
            <Plus size={17} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Zoom out"
            disabled={zoom <= 1}
            onClick={() => setZoom((z) => Math.max(1, z - 0.25))}
          >
            <Minus size={17} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Reset map"
            onClick={() => setZoom(1)}
          >
            <RotateCcw size={15} />
          </Button>
        </div>
      </div>
      {active && (
        <button className="map-preview" onClick={() => onDetail(active.id)}>
          <span className="preview-icon">{active.number}</span>
          <span>
            <small>{active.category}</small>
            <strong>{active.name}</strong>
            <span>View resource details</span>
          </span>
          <ArrowUpRight size={20} />
        </button>
      )}
      <div className="map-caption">
        Illustrative schematic · not to scale · positions are not geographic
      </div>
    </div>
  );
}
