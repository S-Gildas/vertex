import type { Metadata } from "next";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { PortableText, type PortableTextComponents } from "next-sanity";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonSidebar, LessonTabs, LessonViewEvent, type LessonNavModule } from "@/components/lesson-content";
import { LessonVideo } from "@/components/lesson-video";
import { Icon, VertexLogo } from "@/components/vertex-ui";
import { getLessonBySlug } from "@/sanity/data";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ start?: string | string[] }>;
};

function formatDuration(seconds: number | null) {
  const minutes = Math.max(0, Math.round((seconds ?? 0) / 60));
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m`;
}

function youtubeId(videoUrl: string | null) {
  if (!videoUrl) return null;
  try {
    const url = new URL(videoUrl);
    if (url.protocol !== "https:") return null;
    let id: string | null = null;
    if (url.hostname === "youtu.be") id = url.pathname.slice(1);
    if (url.hostname === "youtube.com" || url.hostname === "www.youtube.com" || url.hostname === "m.youtube.com") {
      id = url.pathname === "/watch" ? url.searchParams.get("v") : url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)$/)?.[1] ?? null;
    }
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

function startSeconds(value: string | string[] | undefined, duration: number | null) {
  if (typeof value !== "string" || !/^\d{1,6}$/.test(value)) return 0;
  const seconds = Number(value);
  return Number.isSafeInteger(seconds) ? Math.min(seconds, Math.max(0, duration ?? 86400)) : 0;
}

function safeHttpsUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? safeHttpsUrl(value.href) : null;
      return href ? <a href={href} target="_blank" rel="noopener noreferrer">{children}</a> : <>{children}</>;
    },
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  return { title: lesson ? `${lesson.title ?? "Lesson"} | Vertex` : "Lesson not found | Vertex" };
}

export default async function LessonPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const lesson = await getLessonBySlug(slug);
  if (!lesson) notFound();

  const course = lesson.course;
  const modules: LessonNavModule[] = (course?.modules ?? []).map((module) => ({
    _key: module._key,
    title: module.title,
    lessons: module.lessons,
  }));
  const orderedLessons = modules.flatMap((module) => (module.lessons ?? []).filter((item): item is NonNullable<typeof item> => Boolean(item)));
  const position = orderedLessons.findIndex((item) => item._id === lesson._id);
  const previous = position > 0 ? orderedLessons[position - 1] : null;
  const next = position >= 0 ? orderedLessons[position + 1] : null;
  const courseHref = course?.slug ? `/courses/${course.slug}` : "/#courses";
  const courseTitle = course?.title ?? "Course";
  const activeModule = course?.module;
  const intro = lesson.notes?.[0]?.style === "normal" && !lesson.notes[0].listItem ? lesson.notes[0] : null;
  const introText = intro?.children?.map((child) => child.text ?? "").join("") ?? null;
  const restNotes = (intro ? lesson.notes?.slice(1) : lesson.notes)?.filter((block) => {
    const text = block.children?.map((child) => child.text ?? "").join("") ?? "";
    return text !== "What this lesson covers" && !(block.listItem && lesson.keyPoints?.includes(text));
  });
  const { start } = await searchParams;
  const currentStart = startSeconds(start, lesson.duration);

  return <div className="lesson-page">
    <LessonViewEvent lessonId={lesson._id} courseId={course?._id ?? null} />
    <div className="lesson-shell">
      <header className="course-header lesson-header">
        <Link className="course-brand" href="/" aria-label="Vertex home"><VertexLogo size="large" /></Link>
        <nav className="course-nav" aria-label="Main navigation"><Link href="/#courses">Courses</Link><span>My Learning</span></nav>
        <div className="course-header-end">
          <span className="course-notification" aria-label="Notifications"><Icon name="bell" size={26} /></span>
          <Show when="signed-out"><SignInButton><button className="home-auth-sign-in" type="button">Sign in</button></SignInButton><SignUpButton><button className="home-auth-sign-up" type="button">Sign up</button></SignUpButton></Show>
          <Show when="signed-in"><span className="course-user-button"><UserButton /></span></Show>
        </div>
      </header>

      <div className="lesson-layout">
        <LessonSidebar modules={modules} currentLessonId={lesson._id} courseHref={courseHref} courseTitle={courseTitle} courseImage={course?.coverImage?.asset?.url ?? null} />
        <main className="lesson-main">
          <nav className="lesson-breadcrumb" aria-label="Breadcrumb">
            <Link href="/#courses">All Courses</Link><Icon name="chevron" size={15} />
            <Link href={courseHref}>{courseTitle}</Link><Icon name="chevron" size={15} />
            {activeModule ? <><span>{activeModule.title}</span><Icon name="chevron" size={15} /></> : null}
            <span aria-current="page">{lesson.title}</span>
          </nav>

          <div className="lesson-title-row">
            <div><span className="lesson-eyebrow">Lesson {activeModule ? `${activeModule.moduleIndex + 1}.${activeModule.lessonIndex + 1}` : ""}</span><h1>{lesson.title}</h1></div>
            <span className="lesson-title-bookmark" aria-label="Bookmark unavailable"><Icon name="bookmark" size={21} /></span>
          </div>
          {introText ? <p className="lesson-deck">{introText}</p> : null}
          <div className="lesson-meta">
            <span><Icon name="clock" size={17} />{formatDuration(lesson.duration)}</span>
            {course?.instructor?.name ? <span><Icon name="user" size={17} />{course.instructor.name}</span> : null}
            {lesson.studentCount !== null ? <span><Icon name="user" size={17} />{lesson.studentCount?.toLocaleString("en-US")} students</span> : null}
            {lesson.freePreview ? <span className="lesson-preview">Free preview</span> : null}
          </div>

          <LessonVideo videoId={youtubeId(lesson.videoUrl)} start={currentStart} />

          <LessonTabs content={<div className="lesson-article">
            <section className="lesson-overview"><h2>Overview</h2>{introText ? <p>{introText}</p> : <p>Explore this lesson in the video above.</p>}</section>
            {restNotes?.length ? <div className="lesson-rich-text"><PortableText value={restNotes} components={portableTextComponents} /></div> : null}
            {lesson.keyPoints?.length ? <section className="lesson-key-points"><h2>In this lesson you will:</h2><ul>{lesson.keyPoints.map((point) => <li key={point}><Icon name="check-circle" size={18} />{point}</li>)}</ul></section> : null}
            {lesson.proTip ? <aside className="lesson-pro-tip"><span aria-hidden="true">☼</span><div><h2>Pro Tip</h2><p>{lesson.proTip}</p></div></aside> : null}
            {lesson.resources?.length ? <section className="lesson-resources"><h2>Resources</h2><div className="lesson-resource-grid">{lesson.resources.map((resource) => {
              const href = safeHttpsUrl(resource.url);
              if (!href) return null;
              return <a href={href} target="_blank" rel="noopener noreferrer" key={resource._key} className="lesson-resource-card"><span className="lesson-resource-icon"><Icon name={resource.type === "code" ? "folder" : "document"} size={19} /></span><span><strong>{resource.title}</strong>{resource.description ? <small>{resource.description}</small> : null}</span><Icon name="external" size={14} /></a>;
            })}</div></section> : null}
          </div>} />
        </main>
      </div>

      <nav className="lesson-footer" aria-label="Lesson navigation">
        {previous?.slug ? <Link className="lesson-footer-link previous" href={`/lessons/${previous.slug}`}><span>← &nbsp; Previous Lesson</span><strong>{previous.title}</strong><small>{formatDuration(previous.duration)}</small></Link> : <span />}
        {next?.slug ? <Link className="lesson-footer-link next" href={`/lessons/${next.slug}`}><span>Next Lesson &nbsp; →</span><strong>{next.title}</strong><small>{formatDuration(next.duration)}</small></Link> : <span />}
      </nav>
    </div>
  </div>;
}
