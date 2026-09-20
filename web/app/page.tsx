import { HomeSearch } from "@/components/home-search";
import { HomeCourseCollection } from "@/components/home-course-collection";
import { Icon, VertexLogo } from "@/components/vertex-ui";
import { getCourses, type CourseCard as CourseCardData } from "@/sanity/data";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>;
}

function StarIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round"><path d="m12 2 2.9 6.6 7.1.7-5.4 4.7 1.6 7-6.2-3.7L5.8 21l1.6-7L2 9.3l7.1-.7L12 2Z" /></svg>;
}

function formatLevel(level: CourseCardData["level"]) {
  if (!level) return "";
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function formatDuration(totalSeconds: CourseCardData["duration"]) {
  const minutes = Math.max(0, Math.round((totalSeconds ?? 0) / 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

function formatModuleCount(moduleCount: CourseCardData["moduleCount"]) {
  return `${moduleCount} ${moduleCount === 1 ? "module" : "modules"}`;
}

function CourseCard({ course }: { course: CourseCardData }) {
  const coverImageUrl = course.coverImage?.asset?.url;

  return <article className="home-course-card">
    <span className="home-course-art">
      {coverImageUrl ? <Image className="home-course-art-image" src={coverImageUrl} alt={course.coverImage?.alt ?? ""} width={73} height={73} /> : null}
    </span>
    <h3>{course.title}</h3>
    <p>{course.summary}</p>
    <div className="home-course-meta">
      <span><Icon name="signal" size={16} />{formatLevel(course.level)}</span>
      <span><Icon name="clock" size={16} />{formatDuration(course.duration)}</span>
      <span><Icon name="document" size={16} />{formatModuleCount(course.moduleCount)}</span>
    </div>
  </article>;
}

export default async function Home() {
  const courses = await getCourses();

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
          <Show when="signed-out">
            <SignInButton><button className="home-auth-sign-in" type="button">Sign in</button></SignInButton>
            <SignUpButton><button className="home-auth-sign-up" type="button">Sign up</button></SignUpButton>
          </Show>
          <Show when="signed-in"><span className="home-user-button"><UserButton /></span></Show>
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
          <HomeCourseCollection courseCount={courses.length}>
            {courses.length > 0
              ? courses.map((course) => <CourseCard key={course._id} course={course} />)
              : <p className="home-course-empty">No published courses yet.</p>}
          </HomeCourseCollection>
          <div className="home-announcement"><span className="home-announcement-line" /><StarIcon /><p>New courses and lessons added every week.</p><span className="home-announcement-line" /></div>
          <div className="home-skyline" aria-hidden="true"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
        </section>
      </main>
    </div>
  </div>;
}
