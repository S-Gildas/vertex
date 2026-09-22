"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";
import { Icon } from "@/components/vertex-ui";

export type LessonNavModule = {
  _key: string;
  title: string | null;
  lessons: Array<{ _id: string; title: string | null; slug: string | null; duration: number | null } | null> | null;
};

const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN && process.env.NEXT_PUBLIC_POSTHOG_HOST);

function duration(seconds: number | null) {
  const minutes = Math.max(0, Math.round((seconds ?? 0) / 60));
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
}

export function LessonViewEvent({ lessonId, courseId }: { lessonId: string; courseId: string | null }) {
  useEffect(() => {
    if (analyticsEnabled) posthog.capture("lesson_viewed", { lesson_id: lessonId, course_id: courseId });
  }, [lessonId, courseId]);
  return null;
}

export function LessonSidebar({ modules, currentLessonId, courseHref, courseTitle, courseImage }: { modules: LessonNavModule[]; currentLessonId: string; courseHref: string; courseTitle: string; courseImage: string | null }) {
  const currentModule = modules.findIndex((module) => module.lessons?.some((lesson) => lesson?._id === currentLessonId));
  const [expanded, setExpanded] = useState<number>(currentModule);
  return <aside className="lesson-sidebar" aria-label="Course curriculum">
    <Link className="lesson-back" href={courseHref}><span aria-hidden="true">←</span> Back to course</Link>
    <Link className="lesson-sidebar-course" href={courseHref}>
      <span className="lesson-sidebar-cover">{courseImage ? <Image src={courseImage} alt="" width={48} height={48} /> : courseTitle.charAt(0)}</span>
      <span><strong>{courseTitle}</strong><small>{modules.length} {modules.length === 1 ? "module" : "modules"}</small></span>
    </Link>
    <div className="lesson-sidebar-heading">Course content</div>
    <ol className="lesson-sidebar-modules">
      {modules.map((module, moduleIndex) => <li key={module._key} className={moduleIndex === expanded ? "is-expanded" : ""}>
        <button className="lesson-sidebar-module" type="button" aria-expanded={moduleIndex === expanded} aria-controls={`lesson-module-${module._key}`} onClick={() => setExpanded(moduleIndex === expanded ? -1 : moduleIndex)}>
          <span className="lesson-module-number">{moduleIndex + 1}</span>
          <span className="lesson-module-title">{module.title ?? `Module ${moduleIndex + 1}`}</span>
          <Icon name="chevron-down" size={16} />
        </button>
        <ol id={`lesson-module-${module._key}`} className="lesson-sidebar-lessons" hidden={moduleIndex !== expanded}>
          {(module.lessons ?? []).filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson)).map((lesson, lessonIndex) => <li key={lesson._id} className={lesson._id === currentLessonId ? "is-current" : ""}>
            {lesson.slug ? <Link href={`/lessons/${lesson.slug}`} aria-current={lesson._id === currentLessonId ? "page" : undefined}>
              <span className="lesson-sidebar-lesson-dot" aria-hidden="true" />
              <span><strong>{lesson.title ?? `Lesson ${moduleIndex + 1}.${lessonIndex + 1}`}</strong><small>{lesson._id === currentLessonId ? "Now playing" : duration(lesson.duration)}</small></span>
              {lesson._id === currentLessonId ? <Icon name="play-filled" size={20} /> : null}
            </Link> : <span className="lesson-sidebar-linkless">{lesson.title}</span>}
          </li>)}
        </ol>
      </li>)}
    </ol>
  </aside>;
}

export function LessonTabs({ content }: { content: ReactNode }) {
  const [tab, setTab] = useState<"content" | "notes">("content");
  return <section className="lesson-tab-section">
    <div className="lesson-tabs" role="tablist" aria-label="Lesson information">
      <button role="tab" id="lesson-content-tab" aria-controls="lesson-content-panel" aria-selected={tab === "content"} className={tab === "content" ? "is-active" : ""} onClick={() => setTab("content")}>Lesson Content</button>
      <button role="tab" id="lesson-notes-tab" aria-controls="lesson-notes-panel" aria-selected={tab === "notes"} className={tab === "notes" ? "is-active" : ""} onClick={() => setTab("notes")}>Notes</button>
    </div>
    <div role="tabpanel" id="lesson-content-panel" aria-labelledby="lesson-content-tab" hidden={tab !== "content"}>{content}</div>
    <div role="tabpanel" id="lesson-notes-panel" aria-labelledby="lesson-notes-tab" hidden={tab !== "notes"} className="lesson-empty-notes">Your notes will appear here.</div>
  </section>;
}
