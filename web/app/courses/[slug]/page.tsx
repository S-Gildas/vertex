import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CourseContent, type CourseModuleItem } from "@/components/course-content";
import { CourseBookmarkButton, CourseContinueLink } from "@/components/course-actions";
import { Icon, ProgressBar, VertexLogo } from "@/components/vertex-ui";
import { getCourseBySlug } from "@/sanity/data";

type PageProps = { params: Promise<{ slug: string }> };

function formatDuration(totalSeconds: number) {
  const minutes = Math.max(0, Math.round(totalSeconds / 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

function formatLevel(level: string | null) {
  if (!level) return null;
  return level.charAt(0).toUpperCase() + level.slice(1);
}

function formatStudents(studentCount: number | null) {
  if (!studentCount) return null;
  if (studentCount >= 1000) return `${(studentCount / 1000).toFixed(studentCount >= 10000 ? 0 : 1)}k students`;
  return `${studentCount.toLocaleString("en-US")} students`;
}

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>;
}

function OutcomeIcon({ name }: { name: string | null }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<string, ReactNode> = {
    code: <><path d="m9 8-4 4 4 4"/><path d="m15 8 4 4-4 4"/><path d="m13 5-2 14"/></>,
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/></>,
    gauge: <><path d="M4 18a8 8 0 1 1 16 0"/><path d="m12 14 4-4"/><path d="M7 15h.01M17 15h.01M12 8h.01"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
    lightbulb: <><path d="M9 18h6M10 21h4"/><path d="M8.5 14.5a6 6 0 1 1 7 0c-.9.6-1.5 1.4-1.5 2.5h-4c0-1.1-.6-1.9-1.5-2.5Z"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></>,
    puzzle: <><path d="M4 8h5a2 2 0 1 1 4 0h7v5a2 2 0 1 0 0 4v3h-7a2 2 0 1 0-4 0H4v-5a2 2 0 1 0 0-4V8Z"/></>,
    rocket: <><path d="M14 4c3-2 5-1 6-1 0 1 1 3-1 6l-5 5-5-5 4-5Z"/><path d="m10 9-5 1-2 3 6 1M15 14l-1 6-3 1-1-6M7 17l-3 3"/></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z"/><path d="m9 12 2 2 4-5"/></>,
    sparkles: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z"/><path d="m19 15 .7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7L19 15Z"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m14 10 7-7"/></>,
    workflow: <><rect x="3" y="3" width="6" height="5" rx="1"/><rect x="15" y="16" width="6" height="5" rx="1"/><path d="M9 5.5h4a4 4 0 0 1 4 4V16M15 18.5h-4a4 4 0 0 1-4-4V8"/></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" {...common}>{shapes[name ?? ""] ?? shapes.target}</svg>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return { title: "Course not found | Vertex" };

  return {
    title: `${course.title ?? "Course"} | Vertex`,
    description: course.summary ?? "Explore this Vertex course.",
  };
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const modules: CourseModuleItem[] = (course.modules ?? []).map((module) => {
    const lessons = (module.lessons ?? []).map((lesson) => ({
      _id: lesson._id,
      title: lesson.title,
      slug: lesson.slug,
      duration: lesson.duration,
    }));
    return {
      _key: module._key,
      title: module.title,
      summary: module.summary,
      duration: lessons.reduce((total, lesson) => total + (lesson.duration ?? 0), 0),
      lessons,
    };
  });
  const totalDuration = modules.reduce((total, module) => total + module.duration, 0);
  const totalLessons = modules.reduce((total, module) => total + module.lessons.length, 0);
  const coverImageUrl = course.coverImage?.asset?.url;
  const level = formatLevel(course.level);
  const students = formatStudents(course.studentCount);

  return <div className="course-page">
    <div className="course-shell">
      <header className="course-header">
        <Link className="course-brand" href="/" aria-label="Vertex home"><VertexLogo size="large" /></Link>
        <nav className="course-nav" aria-label="Main navigation">
          <Link href="/#courses">Courses</Link>
          <span>My Learning</span>
        </nav>
        <div className="course-header-end">
          <span className="course-notification" aria-label="Notifications"><Icon name="bell" size={28} /></span>
          <Show when="signed-out">
            <SignInButton><button className="home-auth-sign-in" type="button">Sign in</button></SignInButton>
            <SignUpButton><button className="home-auth-sign-up" type="button">Sign up</button></SignUpButton>
          </Show>
          <Show when="signed-in"><span className="course-user-button"><UserButton /></span></Show>
        </div>
      </header>

      <main className="course-main">
        <nav className="course-breadcrumb" aria-label="Breadcrumb">
          <Link href="/#courses">All Courses</Link>
          <Icon name="chevron" size={17} />
          <span aria-current="page">{course.title}</span>
        </nav>

        <section className="course-hero" aria-labelledby="course-title">
          <div className="course-cover">
            {coverImageUrl ? <Image src={coverImageUrl} alt={course.coverImage?.alt ?? ""} fill priority sizes="(max-width: 700px) 100vw, 300px" /> : <span aria-hidden="true">{course.title?.charAt(0) ?? "V"}</span>}
          </div>
          <div className="course-hero-copy">
            {course.popular ? <span className="course-popular">Popular</span> : null}
            <h1 id="course-title">{course.title}</h1>
            {course.summary ? <p>{course.summary}</p> : null}
            <div className="course-stats" aria-label="Course details">
              {level ? <span><Icon name="signal" size={20} />{level}</span> : null}
              <span><Icon name="clock" size={20} />{formatDuration(totalDuration)}</span>
              <span><Icon name="document" size={20} />{modules.length} {modules.length === 1 ? "module" : "modules"}</span>
              {students ? <span><Icon name="user" size={20} />{students}</span> : null}
            </div>
            <div className="course-actions">
              <CourseContinueLink courseId={course._id} courseSlug={slug} source="hero" className="course-primary-action">Continue Learning <ArrowIcon /></CourseContinueLink>
              <CourseBookmarkButton courseId={course._id} courseSlug={slug} />
            </div>
          </div>
        </section>

        {(course.learningOutcomes?.length ?? 0) > 0 ? <section className="course-outcomes" aria-labelledby="course-outcomes-title">
          <h2 id="course-outcomes-title">What you’ll learn</h2>
          <div className="course-outcome-grid">
            {course.learningOutcomes?.map((outcome) => <article className="course-outcome" key={outcome._key}>
              <span className="course-outcome-icon"><OutcomeIcon name={outcome.icon} /></span>
              <div>
                <h3>{outcome.title}</h3>
                {outcome.description ? <p>{outcome.description}</p> : null}
              </div>
            </article>)}
          </div>
        </section> : null}

        <section className="course-curriculum" id="course-content" aria-labelledby="course-content-title">
          <div className="course-section-heading">
            <h2 id="course-content-title">Course Content</h2>
            <p>{modules.length} {modules.length === 1 ? "module" : "modules"}<span>•</span>{formatDuration(totalDuration)}<span>•</span>{totalLessons} {totalLessons === 1 ? "lesson" : "lessons"}</p>
          </div>
          {modules.length > 0 ? <CourseContent modules={modules} /> : <p className="course-empty">Course content is coming soon.</p>}
        </section>

        <section className="course-progress-strip" aria-label="Your course progress">
          <div className="course-progress-copy"><span>Your Progress</span><strong>0% complete</strong></div>
          <ProgressBar value={0} />
          <CourseContinueLink courseId={course._id} courseSlug={slug} source="progress_strip" className="course-progress-action">Continue Learning <ArrowIcon /></CourseContinueLink>
        </section>
      </main>
      <div className="course-skyline" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>
    </div>
  </div>;
}
