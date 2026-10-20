import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Compass,
  Search,
  X,
  Map,
  List,
  SlidersHorizontal,
  Check,
  Menu,
  BookOpen,
} from "lucide-react";
import type { Category, Filters, Review } from "./types";
import { categories, resources, demoReviews } from "./data/resources";
import { filterResources } from "./lib/search";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Button } from "./components/ui/button";
import { CardContainer } from "./components/ui/3d-card";
import { AmbientParticles, CampusScene } from "./components/hero/CampusScene";
import { ResourceCard } from "./components/resources/ResourceCard";
import { ResourceDetail } from "./components/resources/ResourceDetail";
import { CampusMap, categoryIcons } from "./components/map/CampusMap";

const validSaved = (v: unknown): v is string[] =>
  Array.isArray(v) &&
  v.every((id) => typeof id === "string" && resources.some((r) => r.id === id));
const validReviews = (v: unknown): v is Review[] =>
  Array.isArray(v) &&
  v.every(
    (r) =>
      typeof r === "object" &&
      r !== null &&
      typeof r.id === "string" &&
      typeof r.resourceId === "string" &&
      resources.some((resource) => resource.id === r.resourceId) &&
      typeof r.name === "string" &&
      r.name.trim().length > 0 &&
      r.name.length <= 50 &&
      typeof r.comment === "string" &&
      r.comment.trim().length >= 10 &&
      r.comment.length <= 1000 &&
      Number.isInteger(r.rating) &&
      r.rating >= 1 &&
      r.rating <= 5 &&
      typeof r.createdAt === "string" &&
      !Number.isNaN(Date.parse(r.createdAt)) &&
      !r.demo,
  );
const initialFilters: Filters = {
  query: "",
  category: "All Resources",
  openOnly: false,
  savedOnly: false,
};
export default function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [saved, setSaved, saveError] = useLocalStorage(
    "campus-atlas:saved:v1",
    [],
    validSaved,
  );
  const [localReviews, setLocalReviews, reviewError] = useLocalStorage(
    "campus-atlas:reviews:v1",
    [],
    validReviews,
  );
  const [selected, setSelected] = useState("writing"),
    [detail, setDetail] = useState<string | null>(null),
    [hovered, setHovered] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date()),
    [mobileView, setMobileView] = useState<"list" | "map">("list"),
    [mobileMenu, setMobileMenu] = useState(false),
    [searchFocused, setSearchFocused] = useState(false),
    [sort, setSort] = useState("recommended");
  const [announcement, setAnnouncement] = useState("");
  const detailOpener = useRef<HTMLElement | null>(null);
  function openDetail(id: string) {
    detailOpener.current =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    setDetail(id);
  }
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const allReviews = [...demoReviews, ...localReviews];
  const filtered = filterResources(resources, filters, saved, now).sort(
    (a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : resources.indexOf(a) - resources.indexOf(b),
  );
  const active = filtered.find((r) => r.id === selected) ?? filtered[0];
  const detailResource = resources.find((r) => r.id === detail);
  function setFilter(patch: Partial<Filters>) {
    setFilters((f) => ({ ...f, ...patch }));
  }
  function scrollTo(id: string) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
      block: "start",
    });
  }
  function explore(category: Category | "All Resources" = "All Resources") {
    setFilter({ category, savedOnly: false });
    scrollTo("explore");
  }
  function toggleSaved(id: string) {
    const wasSaved = saved.includes(id);
    setSaved(wasSaved ? saved.filter((s) => s !== id) : [...saved, id]);
    setAnnouncement(
      wasSaved
        ? "Resource removed from saved."
        : "Resource saved on this device.",
    );
  }
  function showSaved() {
    setFilters({ ...initialFilters, savedOnly: true });
    setMobileView("list");
    scrollTo("explore");
  }
  return (
    <>
      <a className="skip-link" href="#explore">
        Skip to resource finder
      </a>
      <header className="navbar">
        <div className="nav-inner">
          <a className="brand" href="#" aria-label="Campus Atlas home">
            <span className="logo-mark">
              <AtlasMark size={22} />
            </span>
            <span>
              Campus Atlas<span className="brand-dot">.</span>
            </span>
          </a>
          <nav
            className={mobileMenu ? "desktop-nav menu-open" : "desktop-nav"}
            aria-label="Main navigation"
          >
            <a
              href="#discover"
              onClick={() => {
                setMobileMenu(false);
              }}
            >
              Discover
            </a>
            <a
              href="#explore"
              onClick={() => {
                setMobileView("map");
                setMobileMenu(false);
              }}
            >
              Explore map
            </a>
            <a href="#categories" onClick={() => setMobileMenu(false)}>
              Categories
            </a>
            <button
              className={filters.savedOnly ? "nav-active" : ""}
              onClick={showSaved}
            >
              <Bookmark size={15} />
              Saved <span className="saved-count">{saved.length}</span>
            </button>
          </nav>
          <span className="nav-campus">
            Made for <strong>CCNY</strong>
            <span className="ccny-monogram">
              CC
              <br />
              NY
            </span>
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu-toggle"
            aria-label={mobileMenu ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenu}
            onClick={() => setMobileMenu((v) => !v)}
          >
            {mobileMenu ? <X /> : <Menu />}
          </Button>
        </div>
      </header>
      <main>
        <section className="hero wrap" id="discover">
          <AmbientParticles />
          <div className="hero-copy">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <div className="hero-eyebrow">
                <span />
                THE CITY COLLEGE OF NEW YORK
              </div>
              <h1>
                Your campus.
                <br />
                Everything
                <br />
                <span>within reach.</span>
              </h1>
              <p className="hero-description">
                Discover the spaces, services, and support
                <br className="desktop-break" /> that make life at CCNY easier.
              </p>
            </motion.div>
            <form
              className="hero-search"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                setSearchFocused(false);
                explore(filters.category);
              }}
            >
              <Search size={20} />
              <input
                aria-label="Search campus resources"
                placeholder="What can we help you find?"
                value={filters.query}
                onChange={(e) =>
                  setFilter({ query: e.target.value, savedOnly: false })
                }
                onFocus={() => setSearchFocused(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.form?.contains(e.relatedTarget))
                    setSearchFocused(false);
                }}
              />
              {filters.query && (
                <button
                  className="search-clear"
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setFilter({ query: "" })}
                >
                  <X size={16} />
                </button>
              )}
              <Button size="icon" type="submit" aria-label="Find resources">
                <ArrowRight size={20} />
              </Button>
              {searchFocused && (
                <div className="search-suggestions">
                  <span>Try a little direction</span>
                  {["writing center", "tutoring", "food pantry"].map((q) => (
                    <button
                      type="button"
                      key={q}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        setFilter({
                          query: q,
                          category: "All Resources",
                          savedOnly: false,
                        });
                        setSearchFocused(false);
                        scrollTo("explore");
                      }}
                    >
                      <Search size={14} />
                      {q}
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </div>
              )}
            </form>
            <div className="quick-search">
              <span>Start with</span>
              {(
                ["Tutoring", "Wellness", "Food & Essentials"] as Category[]
              ).map((c) => (
                <button key={c} onClick={() => explore(c)}>
                  {c === "Food & Essentials" ? "Food & essentials" : c}
                  <ArrowUpRight size={12} />
                </button>
              ))}
            </div>
            <div className="hero-footnote">
              <span className="mini-compass">
                <Compass size={16} />
              </span>
              Less searching. More finding your place.
            </div>
          </div>
          <CampusScene />
        </section>
        <div className="campus-strip">
          <div className="wrap">
            <span>
              <span className="small-square" />A little direction makes a big
              difference.
            </span>
            <span>
              Built for students. By students.
              <ArrowDownDiagonal />
            </span>
          </div>
        </div>
        <section className="category-section wrap" id="categories">
          <div className="section-intro">
            <div>
              <span className="eyebrow">FIND YOUR KIND OF SUPPORT</span>
              <h2>
                Whatever you need,
                <br />
                there’s a place for it.
              </h2>
            </div>
            <p>
              Big questions. Small hurdles. Everyday essentials.
              <br />
              There’s a whole campus in your corner.
            </p>
          </div>
          <div className="category-grid">
            {categories.map((category, i) => {
              const Icon = categoryIcons[category.name];
              const card = (
                <button
                  className={`category-card category-${i}`}
                  onClick={() => {
                    setFilter({ query: "", openOnly: false });
                    explore(category.name);
                  }}
                >
                  <div className="category-card-top">
                    <span className="category-icon">
                      <Icon size={23} strokeWidth={1.5} />
                    </span>
                    <ArrowUpRight size={19} />
                  </div>
                  <div>
                    <h3>{category.name}</h3>
                    <p>{category.short}</p>
                  </div>
                  {i === 0 && (
                    <div className="study-art" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <BookOpen size={62} strokeWidth={1} />
                    </div>
                  )}
                </button>
              );
              return i === 0 ? (
                <CardContainer
                  key={category.name}
                  className="featured-category"
                >
                  {card}
                </CardContainer>
              ) : (
                <div key={category.name}>{card}</div>
              );
            })}
          </div>
        </section>
        <section className="explorer-section" id="explore">
          <div className="wrap">
            <div className="section-intro explorer-intro">
              <div>
                <span className="eyebrow">YOUR NEXT STOP</span>
                <h2>
                  {filters.savedOnly
                    ? "Your campus, on hand."
                    : "Good things are closer."}
                </h2>
              </div>
              <p>
                {filters.savedOnly
                  ? "The places you want to come back to."
                  : "Find what you need. See where to go."}
                <br />
                <span className="demo-indicator">
                  Frontend demo · illustrative locations & hours
                </span>
              </p>
            </div>
            <div className="explorer-shell">
              <div className="explorer-toolbar">
                <div className="explorer-search">
                  <Search size={18} />
                  <input
                    aria-label="Search resource results"
                    placeholder="Search by name, category, or building"
                    value={filters.query}
                    onChange={(e) => setFilter({ query: e.target.value })}
                  />
                  {filters.query && (
                    <button
                      aria-label="Clear result search"
                      onClick={() => setFilter({ query: "" })}
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
                <label className="open-filter">
                  <input
                    type="checkbox"
                    checked={filters.openOnly}
                    onChange={(e) => setFilter({ openOnly: e.target.checked })}
                  />
                  <span className="checkbox-ui">
                    {filters.openOnly && <Check size={11} />}
                  </span>
                  Open now <small>(demo)</small>
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setFilters(initialFilters);
                    setSort("recommended");
                  }}
                >
                  Reset filters <SlidersHorizontal size={15} />
                </Button>
              </div>
              <div className="filter-row" aria-label="Filter by category">
                {["All Resources", ...categories.map((c) => c.name)].map(
                  (c) => (
                    <button
                      key={c}
                      aria-pressed={filters.category === c}
                      className={filters.category === c ? "selected" : ""}
                      onClick={() =>
                        setFilter({ category: c as Filters["category"] })
                      }
                    >
                      {c}
                    </button>
                  ),
                )}
              </div>
              <div className="mobile-view-toggle" aria-label="Results view">
                <button
                  aria-pressed={mobileView === "list"}
                  onClick={() => setMobileView("list")}
                >
                  <List size={16} />
                  List
                </button>
                <button
                  aria-pressed={mobileView === "map"}
                  onClick={() => setMobileView("map")}
                >
                  <Map size={16} />
                  Map
                </button>
              </div>
              {filters.savedOnly && (
                <div className="saved-banner">
                  <Bookmark size={16} />
                  Showing saved resources
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFilter({ savedOnly: false })}
                  >
                    Show all <X size={13} />
                  </Button>
                </div>
              )}
              <div className={`explorer-content mobile-${mobileView}`}>
                <div className="results-panel">
                  <div className="results-heading">
                    <span role="status">
                      {filtered.length} resource
                      {filtered.length !== 1 ? "s" : ""}
                      {filters.savedOnly ? " saved" : " to explore"}
                    </span>
                    <select
                      aria-label="Sort resources"
                      value={sort}
                      onChange={(e) => setSort(e.target.value)}
                    >
                      <option value="recommended">Campus order</option>
                      <option value="name">Name A–Z</option>
                    </select>
                  </div>
                  <div className="resource-list">
                    {filtered.map((r) => (
                      <ResourceCard
                        key={r.id}
                        resource={r}
                        saved={saved.includes(r.id)}
                        onSave={() => toggleSaved(r.id)}
                        onSelect={() => {
                          setSelected(r.id);
                          openDetail(r.id);
                        }}
                        onHover={setHovered}
                        active={active?.id === r.id}
                        reviews={allReviews}
                        query={filters.query}
                        now={now}
                      />
                    ))}
                    {!filtered.length && (
                      <div className="empty-state">
                        {filters.savedOnly ? (
                          <Bookmark size={32} />
                        ) : (
                          <Search size={32} />
                        )}
                        <h3>
                          {filters.savedOnly && !saved.length
                            ? "Keep your go-to places close."
                            : "A different direction, perhaps?"}
                        </h3>
                        <p>
                          {filters.savedOnly && !saved.length
                            ? "Tap a bookmark on any resource. It’ll be waiting here next time."
                            : "No resources match these filters. Try another word or explore every category."}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setFilters(initialFilters)}
                        >
                          Explore all resources <ArrowRight size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <CampusMap
                  resources={filtered}
                  active={active}
                  hovered={hovered}
                  onSelect={(id) => {
                    setSelected(id);
                    document.getElementById(`resource-${id}`)?.scrollIntoView({
                      block: "nearest",
                      behavior: "instant",
                    });
                  }}
                  onDetail={openDetail}
                />
              </div>
              <div className="explorer-bottom">
                <Compass size={14} />
                <span>
                  A campus schematic for exploration. Confirm current service
                  details with CCNY before visiting.
                </span>
                <span>America/New_York</span>
              </div>
            </div>
          </div>
        </section>
        <section className="closing-section wrap">
          <span className="closing-mark">
            <Compass size={29} strokeWidth={1} />
          </span>
          <span className="eyebrow">A CAMPUS FULL OF POSSIBILITIES</span>
          <h2>
            You belong here.
            <br />
            <span>So does a little support.</span>
          </h2>
          <p>
            From the first week to the final stretch, find your way to what
            helps.
          </p>
          <Button
            onClick={() => {
              setFilters(initialFilters);
              scrollTo("explore");
            }}
          >
            Find your next stop <ArrowUpRight size={17} />
          </Button>
        </section>
      </main>
      <footer className="footer wrap">
        <div>
          <a className="brand" href="#">
            <span className="logo-mark">
              <AtlasMark size={18} />
            </span>
            <span>Campus Atlas.</span>
          </a>
          <p>Campus Resource Finder for CCNY</p>
        </div>
        <p>
          Made with purpose by Team Clickbait.
          <br />
          <span>CSc 47300 · Fall 2026 · Professor Isiah Garrow</span>
        </p>
        <a
          className="text-link"
          href="https://www.ccny.cuny.edu/"
          target="_blank"
          rel="noreferrer"
        >
          Official CCNY website <ArrowUpRight size={14} />
        </a>
      </footer>
      <ResourceDetail
        resource={detailResource}
        onClose={() => setDetail(null)}
        onReturnFocus={() =>
          detailOpener.current?.focus({ preventScroll: true })
        }
        saved={!!detail && saved.includes(detail)}
        onSave={() => detail && toggleSaved(detail)}
        reviews={allReviews}
        onReview={(review) => setLocalReviews([...localReviews, review])}
        now={now}
      />
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
      {(saveError || reviewError) && (
        <div className="storage-warning" role="alert">
          Browser storage is unavailable. Changes will last only until you
          refresh.
        </div>
      )}
    </>
  );
}
function AtlasMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 2 28 29 16 23 4 29Z" fill="currentColor" />
      <path d="M13 24V15l3-5 3 5v9l-3-2Z" fill="#603c91" />
    </svg>
  );
}
function ArrowDownDiagonal() {
  return <ArrowUpRight size={15} style={{ transform: "rotate(90deg)" }} />;
}
