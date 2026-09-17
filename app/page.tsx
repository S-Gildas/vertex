import { HomeSearch } from "@/components/home-search";
import { Icon, VertexLogo } from "@/components/vertex-ui";
import Link from "next/link";

const courses = [
  {
    title: "Next.js for Production",
    description: "Build scalable, high-performance web applications with Next.js.",
    level: "Intermediate",
    duration: "18h 24m",
    modules: "12 modules",
    artwork: "next",
  },
  {
    title: "Docker Essentials",
    description: "Containerize applications and streamline your development workflow.",
    level: "Beginner",
    duration: "10h 12m",
    modules: "8 modules",
    artwork: "docker",
  },
  {
    title: "TypeScript Deep Dive",
    description: "Go beyond the basics and write safer, more expressive code.",
    level: "Intermediate",
    duration: "14h 36m",
    modules: "10 modules",
    artwork: "typescript",
  },
] as const;

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>;
}

function StarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"><path d="m12 2 2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z" /></svg>;
}

function CourseArtwork({ kind }: { kind: (typeof courses)[number]["artwork"] }) {
  if (kind === "next") return <span className="home-course-art home-course-art-next" aria-hidden="true">N</span>;
  if (kind === "typescript") return <span className="home-course-art home-course-art-typescript" aria-hidden="true">TS</span>;

  return <span className="home-course-art home-course-art-docker" aria-hidden="true"><svg viewBox="0 0 82 72" fill="none"><g fill="#1788CA" stroke="#103A61" strokeWidth="1.5"><path d="M12 25h9v9h-9zM23 25h9v9h-9zM34 25h9v9h-9zM45 25h9v9h-9zM23 14h9v9h-9zM34 14h9v9h-9zM45 14h9v9h-9zM34 3h9v9h-9zM45 3h9v9h-9z"/><path d="M4 36h54c4-3 6-8 6-16 6 1 9 5 8 10 3-1 6-1 8 1-2 5-7 8-13 8-5 17-18 26-35 26C15 65 5 54 4 36Z"/></g><path d="M8 39c5 0 10 0 14 1M27 57c11 2 20-1 27-9" stroke="#fff" strokeWidth="2" strokeLinecap="round"/><circle cx="18" cy="44" r="1.5" fill="#103A61"/></svg></span>;
}

function CourseCard({ course }: { course: (typeof courses)[number] }) {
  return <article className="home-course-card">
    <CourseArtwork kind={course.artwork} />
    <h3>{course.title}</h3>
    <p>{course.description}</p>
    <div className="home-course-meta">
      <span><Icon name="signal" size={16} />{course.level}</span>
      <span><Icon name="clock" size={16} />{course.duration}</span>
      <span><Icon name="document" size={16} />{course.modules}</span>
    </div>
  </article>;
}

export default function Home() {
  return <div className="home-page">
    <div className="home-shell">
      <header className="home-header">
        <Link className="home-brand" href="/" aria-label="Vertex home"><VertexLogo size="large" /></Link>
        <nav className="home-nav" aria-label="Main navigation">
          <a href="#courses">Courses</a>
          <span>My Learning</span>
        </nav>
        <div className="home-header-end">
          <span className="home-notification" aria-label="Notifications"><Icon name="bell" size={28} /></span>
          <span className="home-avatar" aria-label="Profile"><span className="home-avatar-face" /><span className="home-avatar-hair" /><span className="home-avatar-body" /></span>
        </div>
      </header>

      <main>
        <section className="home-hero" aria-labelledby="home-title">
          <span className="home-eyebrow">Intelligent Learning</span>
          <h1 id="home-title">Search your learning<br />in plain English.</h1>
          <p>Vertex understands what you want to learn and<br className="home-desktop-break" /> finds the exact lessons across all your courses.</p>
          <a className="home-primary-link" href="#courses">Explore Courses <ArrowIcon /></a>
          <HomeSearch />
        </section>

        <section className="home-courses" id="courses" aria-labelledby="courses-title">
          <div className="home-section-heading"><h2 id="courses-title">All Courses</h2><a href="#courses">View all courses <ArrowIcon /></a></div>
          <div className="home-course-grid">{courses.map((course) => <CourseCard key={course.title} course={course} />)}</div>
          <div className="home-announcement"><span className="home-announcement-line" /><StarIcon /><p>New courses and lessons added every week.</p><span className="home-announcement-line" /></div>
          <div className="home-skyline" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
        </section>
      </main>
    </div>
  </div>;
}
