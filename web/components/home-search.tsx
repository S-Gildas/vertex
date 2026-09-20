"use client";

import { useEffect, useRef, type FormEvent } from "react";
import posthog from "posthog-js";
import { Icon } from "@/components/vertex-ui";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
  process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

export function HomeSearch() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape" && document.activeElement === inputRef.current) inputRef.current?.blur();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const queryLength = inputRef.current?.value.trim().length ?? 0;
    if (queryLength === 0 || !isPostHogConfigured) return;

    posthog.capture("learning_search_submitted", {
      query_length: queryLength,
      entry_point: "home_hero",
    });
  }

  return <form className="home-search" onSubmit={handleSubmit}><Icon name="search" size={29} /><label className="sr-only" htmlFor="home-search-input">Search your learning</label><input ref={inputRef} id="home-search-input" type="search" placeholder="Ask anything about your learning..." /><kbd>⌘ K</kbd></form>;
}
