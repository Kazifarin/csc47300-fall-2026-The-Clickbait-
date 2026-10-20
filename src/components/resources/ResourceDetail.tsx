import { useState, useRef, type FormEvent } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  X,
  MapPin,
  ArrowUpRight,
  Bookmark,
  Star,
  Clock3,
  ExternalLink,
  Check,
  MessageSquare,
} from "lucide-react";
import type { Resource, Review } from "../../types";
import { days, campusTime, formatTime, getStatus } from "../../lib/hours";
import { Button } from "../ui/button";
import { Status } from "./ResourceCard";

export function ResourceDetail({
  resource,
  onClose,
  onReturnFocus,
  saved,
  onSave,
  reviews,
  onReview,
  now,
}: {
  resource: Resource | undefined;
  onClose: () => void;
  onReturnFocus: () => void;
  saved: boolean;
  onSave: () => void;
  reviews: Review[];
  onReview: (review: Review) => void;
  now: Date;
}) {
  return (
    <Dialog.Root
      open={!!resource}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="sheet-overlay" />
        <Dialog.Content
          className="detail-sheet"
          aria-describedby="detail-description"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
            onReturnFocus();
          }}
        >
          <Dialog.Close asChild>
            <Button
              variant="outline"
              size="icon"
              className="sheet-close"
              aria-label="Close resource details"
            >
              <X size={19} />
            </Button>
          </Dialog.Close>
          {resource && (
            <DetailContent
              key={resource.id}
              resource={resource}
              saved={saved}
              onSave={onSave}
              reviews={reviews}
              onReview={onReview}
              now={now}
            />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
function DetailContent({
  resource: r,
  saved,
  onSave,
  reviews,
  onReview,
  now,
}: {
  resource: Resource;
  saved: boolean;
  onSave: () => void;
  reviews: Review[];
  onReview: (review: Review) => void;
  now: Date;
}) {
  const ownReviews = reviews
    .filter((v) => v.resourceId === r.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const average = ownReviews.length
    ? ownReviews.reduce((s, v) => s + v.rating, 0) / ownReviews.length
    : null;
  const reviewRef = useRef<HTMLTextAreaElement>(null);
  const today = campusTime(now).day;
  const status = getStatus(r.hours, now);
  return (
    <>
      <div className="detail-top">
        <span className="eyebrow">
          {r.category} / {r.number}
        </span>
        <Dialog.Title>{r.name}</Dialog.Title>
        <Status resource={r} now={now} />
        <Dialog.Description id="detail-description">
          {r.description}
        </Dialog.Description>
        <div className="detail-actions">
          <Button variant="outline" onClick={onSave}>
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            {saved ? "Saved resource" : "Save resource"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              reviewRef.current?.scrollIntoView({
                behavior: "instant",
                block: "center",
              });
              reviewRef.current?.focus({ preventScroll: true });
            }}
          >
            <MessageSquare size={16} />
            Write a review
          </Button>
        </div>
      </div>
      <div className="detail-body">
        <div className="data-note">
          <strong>Classroom demonstration</strong>
          <p>
            Locations and schedules are illustrative, not verified service
            information. Confirm details with CCNY before visiting. Holiday
            exceptions are not included.
          </p>
        </div>
        <section>
          <h3>
            <MapPin size={17} />
            Find your way
          </h3>
          <p>
            <strong>{r.building}</strong>
            <br />
            {r.location}
          </p>
          <p className="muted">Phone and room details are unconfirmed.</p>
          <a
            className="text-link"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.name} City College of New York`)}`}
            target="_blank"
            rel="noreferrer"
          >
            Search directions in Google Maps <ArrowUpRight size={15} />
          </a>
          <small className="block muted">
            Opens a place search; confirm the destination before traveling.
          </small>
        </section>
        <section>
          <h3>How this resource can help</h3>
          <div className="service-tags">
            {r.services.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </section>
        <section>
          <h3>
            <Clock3 size={17} />
            Weekly hours{" "}
            <span className="section-aside">
              Example schedule · Eastern Time
            </span>
          </h3>
          <p className="muted">{status.detail}</p>
          <dl className="hours-list">
            {[1, 2, 3, 4, 5, 6, 0].map((day) => (
              <div className={day === today ? "today" : ""} key={day}>
                <dt>
                  {days[day]}
                  {day === today && <small>Today</small>}
                </dt>
                <dd>
                  {r.hours[day] == null
                    ? "Unconfirmed"
                    : r.hours[day]!.length === 0
                      ? "Closed"
                      : r.hours[day]!.map(
                          (i) =>
                            `${formatTime(i.open)} – ${formatTime(i.close)}${i.close <= i.open ? " (+1 day)" : ""}`,
                        ).join(" / ")}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section>
          <div className="review-title">
            <h3>Student perspectives</h3>
            {average !== null && (
              <span>
                <Star size={17} fill="currentColor" />
                {average.toFixed(1)}{" "}
                <small>
                  / 5 · {ownReviews.length} review
                  {ownReviews.length !== 1 ? "s" : ""}
                </small>
              </span>
            )}
          </div>
          <p className="muted">
            Sample reviews are labeled. Your submissions stay in this browser.
          </p>
          {ownReviews.length > 0 && (
            <div
              className="rating-distribution"
              aria-label="Rating distribution"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n}>
                  <span>
                    {n} <Star size={10} />
                  </span>
                  <meter
                    aria-label={`${n} star reviews`}
                    min={0}
                    max={ownReviews.length}
                    value={ownReviews.filter((v) => v.rating === n).length}
                  >
                    {ownReviews.filter((v) => v.rating === n).length}
                  </meter>
                  <small>
                    {ownReviews.filter((v) => v.rating === n).length}
                  </small>
                </div>
              ))}
            </div>
          )}
          <div className="review-list">
            {ownReviews.length ? (
              ownReviews.map((review) => (
                <article key={review.id}>
                  <div className="review-author">
                    <span className="avatar">
                      {review.name.charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <strong>{review.name}</strong>
                      <small>
                        {review.demo
                          ? "Demo review · fictional example"
                          : new Date(review.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                timeZone: "America/New_York",
                              },
                            )}
                      </small>
                    </div>
                    <span
                      className="review-stars"
                      aria-label={`${review.rating} out of 5 stars`}
                    >
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < review.rating ? "currentColor" : "none"}
                        />
                      ))}
                    </span>
                  </div>
                  <p>{review.comment}</p>
                </article>
              ))
            ) : (
              <p className="review-empty">
                A new perspective starts with you. Be the first to leave a
                review.
              </p>
            )}
          </div>
          <ReviewForm
            resource={r}
            onReview={onReview}
            textareaRef={reviewRef}
          />
        </section>
        <a
          className="text-link"
          href="https://www.ccny.cuny.edu/"
          target="_blank"
          rel="noreferrer"
        >
          Visit the official CCNY website <ExternalLink size={14} />
        </a>
      </div>
    </>
  );
}
function ReviewForm({
  resource,
  onReview,
  textareaRef,
}: {
  resource: Resource;
  onReview: (review: Review) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const [rating, setRating] = useState(0),
    [comment, setComment] = useState(""),
    [name, setName] = useState(""),
    [error, setError] = useState(""),
    [success, setSuccess] = useState(false);
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSuccess(false);
    if (!rating || comment.trim().length < 10 || comment.trim().length > 1000) {
      setError(
        "Choose a star rating and write a review between 10 and 1,000 characters.",
      );
      return;
    }
    onReview({
      id: crypto.randomUUID(),
      resourceId: resource.id,
      name: name.trim() || "Anonymous student",
      rating,
      comment: comment.trim(),
      createdAt: new Date().toISOString(),
    });
    setComment("");
    setRating(0);
    setName("");
    setError("");
    setSuccess(true);
  }
  return (
    <form className="review-form" onSubmit={submit} noValidate>
      <h4>Share your experience</h4>
      <fieldset>
        <legend>
          Your rating <span aria-hidden="true">*</span>
        </legend>
        <div className="star-picker">
          {[1, 2, 3, 4, 5].map((n) => (
            <label key={n}>
              <input
                type="radio"
                required
                name={`rating-${resource.id}`}
                value={n}
                checked={rating === n}
                onChange={() => {
                  setRating(n);
                  setSuccess(false);
                }}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                aria-describedby={error ? "review-error" : undefined}
              />
              <Star size={27} fill={n <= rating ? "currentColor" : "none"} />
            </label>
          ))}
          <span>{rating ? `${rating} out of 5` : "Select a rating"}</span>
        </div>
      </fieldset>
      <label htmlFor="review-name">
        Name <span className="muted">(optional)</span>
      </label>
      <input
        id="review-name"
        value={name}
        maxLength={50}
        placeholder="Or keep it anonymous"
        onChange={(e) => setName(e.target.value)}
      />
      <label htmlFor="review-comment">
        Your review <span aria-hidden="true">*</span>
      </label>
      <textarea
        required
        minLength={10}
        id="review-comment"
        ref={textareaRef}
        rows={4}
        value={comment}
        maxLength={1000}
        placeholder="What would help another student to know?"
        aria-invalid={!!error}
        aria-describedby={error ? "review-error" : "review-help"}
        onChange={(e) => {
          setComment(e.target.value);
          setSuccess(false);
        }}
      />
      <small id="review-help" className="muted">
        10–1,000 characters · {comment.length}/1,000 · saved on this device
      </small>
      {error && (
        <p id="review-error" className="form-error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="form-success" role="status">
          <Check size={16} />
          Your review has been added.
        </p>
      )}
      <Button type="submit">
        Post review <ArrowUpRight size={16} />
      </Button>
    </form>
  );
}
