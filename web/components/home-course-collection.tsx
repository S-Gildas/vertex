"use client";

import { useState, type ReactNode } from "react";
import posthog from "posthog-js";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function ArrowIcon() {
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16m-7-7 7 7-7 7" /></svg>;
}

export function HomeCourseCollection({ children, courseCount }: { children: ReactNode; courseCount: number }) {
  const [isExpanded, setIsExpanded] = useState(false);

  function toggleCollection() {
    const willExpand = !isExpanded;
    setIsExpanded(willExpand);
    if (isPostHogConfigured) {
      posthog.capture("course_collection_toggled", {
        expanded: willExpand,
        course_count: courseCount,
      });
    }
  }

  return <>
    <div className="home-section-heading">
      <h2 id="courses-title">All Courses</h2>
      {courseCount > 3 ? <button
        className="home-course-toggle"
        type="button"
        aria-controls="home-course-grid"
        aria-expanded={isExpanded}
        onClick={toggleCollection}
      >
        {isExpanded ? "Show fewer courses" : "View all courses"} <ArrowIcon />
      </button> : null}
    </div>
    <div className={`home-course-grid${isExpanded ? " is-expanded" : ""}`} id="home-course-grid">
      {children}
    </div>
  </>;
}
