"use client";

import { useState } from "react";
import { Icon } from "@/components/vertex-ui";

type LessonItem = {
  _id: string;
  title: string | null;
  duration: number | null;
};

export type CourseModuleItem = {
  _key: string;
  title: string | null;
  summary: string | null;
  duration: number;
  lessons: LessonItem[];
};

const INITIAL_MODULE_COUNT = 6;

function formatDuration(totalSeconds: number) {
  const minutes = Math.max(0, Math.round(totalSeconds / 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

export function CourseContent({ modules }: { modules: CourseModuleItem[] }) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);
  const visibleModules = showAll ? modules : modules.slice(0, INITIAL_MODULE_COUNT);

  function toggleModule(moduleKey: string) {
    setExpandedModules((current) => {
      const next = new Set(current);
      if (next.has(moduleKey)) next.delete(moduleKey);
      else next.add(moduleKey);
      return next;
    });
  }

  return <>
    <ol className="course-module-list" id="course-module-list">
      {visibleModules.map((module, moduleIndex) => {
        const isExpanded = expandedModules.has(module._key);
        const panelId = `course-module-${module._key}`;

        return <li className={`course-module${isExpanded ? " is-expanded" : ""}`} key={module._key}>
          <button
            className="course-module-trigger"
            type="button"
            aria-expanded={isExpanded}
            aria-controls={panelId}
            onClick={() => toggleModule(module._key)}
          >
            <span className="course-module-number">{moduleIndex + 1}</span>
            <span className="course-module-copy">
              <strong>{module.title ?? `Module ${moduleIndex + 1}`}</strong>
              {module.summary ? <span>{module.summary}</span> : null}
            </span>
            <span className="course-module-duration">{formatDuration(module.duration)}</span>
            <Icon name="chevron-down" size={20} className="course-module-chevron" />
          </button>
          <div className="course-module-panel" id={panelId} hidden={!isExpanded}>
            {module.lessons.length > 0 ? <ol>
              {module.lessons.map((lesson, lessonIndex) => <li key={lesson._id}>
                <span>{moduleIndex + 1}.{lessonIndex + 1}</span>
                <strong>{lesson.title ?? `Lesson ${lessonIndex + 1}`}</strong>
                <small>{formatDuration(lesson.duration ?? 0)}</small>
              </li>)}
            </ol> : <p>No lessons in this module yet.</p>}
          </div>
        </li>;
      })}
    </ol>
    {modules.length > INITIAL_MODULE_COUNT ? <button
      className="course-show-all"
      type="button"
      aria-expanded={showAll}
      aria-controls="course-module-list"
      onClick={() => setShowAll((current) => !current)}
    >
      {showAll ? "Show fewer modules" : `Show all ${modules.length} modules`}
      <Icon name="chevron-down" size={18} className={showAll ? "is-rotated" : ""} />
    </button> : null}
  </>;
}
