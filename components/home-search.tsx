"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/vertex-ui";

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

  return <div className="home-search"><Icon name="search" size={29} /><label className="sr-only" htmlFor="home-search-input">Search your learning</label><input ref={inputRef} id="home-search-input" type="search" placeholder="Ask anything about your learning..." /><kbd>⌘ K</kbd></div>;
}
