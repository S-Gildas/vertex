"use client";

import { useState, type ReactNode } from "react";
import posthog from "posthog-js";
import { Icon } from "@/components/vertex-ui";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

type CourseAnalytics = {
  courseId: string;
  courseSlug: string;
};

export function CourseContinueLink({
  courseId,
  courseSlug,
  source,
  className,
  children,
}: CourseAnalytics & {
  source: "hero" | "progress_strip";
  className: string;
  children: ReactNode;
}) {
  function captureContinue() {
    if (!isPostHogConfigured) return;
    posthog.capture("course_learning_continued", {
      course_id: courseId,
      course_slug: courseSlug,
      source,
    });
  }

  return <a className={className} href="#course-content" onClick={captureContinue}>{children}</a>;
}

export function CourseBookmarkButton({ courseId, courseSlug }: CourseAnalytics) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  function toggleBookmark() {
    const willBookmark = !isBookmarked;
    setIsBookmarked(willBookmark);
    if (isPostHogConfigured) {
      posthog.capture("course_bookmark_toggled", {
        course_id: courseId,
        course_slug: courseSlug,
        bookmarked: willBookmark,
      });
    }
  }

  return <button className="course-bookmark" type="button" aria-pressed={isBookmarked} onClick={toggleBookmark}><Icon name="bookmark" size={21} />{isBookmarked ? "Bookmarked" : "Bookmark"}</button>;
}
