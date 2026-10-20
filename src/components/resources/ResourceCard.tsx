import { ArrowUpRight, Bookmark, MapPin, Star } from "lucide-react";
import type { Resource, Review } from "../../types";
import { getStatus } from "../../lib/hours";
import { normalize } from "../../lib/search";
import { Button } from "../ui/button";
export function Highlight({ text, query }: { text: string; query: string }) {
  const q = normalize(query);
  const i = text.toLowerCase().indexOf(q);
  return q && i >= 0 ? (
    <>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  ) : (
    <>{text}</>
  );
}
export function Status({ resource, now }: { resource: Resource; now: Date }) {
  const status = getStatus(resource.hours, now);
  return (
    <span className={`status ${status.state}`}>
      <i />
      {status.label}
      <span className="sr-only"> · example schedule</span>
    </span>
  );
}
export function ResourceCard({
  resource: r,
  saved,
  onSave,
  onSelect,
  onHover,
  active,
  reviews,
  query,
  now,
}: {
  resource: Resource;
  saved: boolean;
  onSave: () => void;
  onSelect: () => void;
  onHover: (id: string | null) => void;
  active: boolean;
  reviews: Review[];
  query: string;
  now: Date;
}) {
  const ownReviews = reviews.filter((review) => review.resourceId === r.id);
  const average = ownReviews.length
    ? ownReviews.reduce((sum, review) => sum + review.rating, 0) /
      ownReviews.length
    : null;
  return (
    <article
      id={`resource-${r.id}`}
      className={`resource-card ${active ? "active" : ""}`}
      onMouseEnter={() => onHover(r.id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(r.id)}
      onBlur={() => onHover(null)}
    >
      <div className="resource-meta">
        <span>
          <Highlight text={r.category} query={query} />
        </span>
        <Button
          size="icon"
          variant="ghost"
          aria-label={`${saved ? "Unsave" : "Save"} ${r.name}`}
          aria-pressed={saved}
          onClick={onSave}
        >
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </Button>
      </div>
      <button className="resource-main" onClick={onSelect}>
        <h3>
          <Highlight text={r.name} query={query} />
          <ArrowUpRight size={18} />
        </h3>
        <p className="location">
          <MapPin size={13} />
          {r.building}
        </p>
        <p className="resource-description">{r.description}</p>
      </button>
      <div className="resource-bottom">
        <Status resource={r} now={now} />
        {average !== null ? (
          <span className="rating">
            <Star size={13} fill="currentColor" />
            {average.toFixed(1)}{" "}
            <span>
              ({ownReviews.length}
              {ownReviews.some((v) => v.demo) ? " · demo" : ""})
            </span>
          </span>
        ) : (
          <span className="muted">No reviews yet</span>
        )}
      </div>
    </article>
  );
}
