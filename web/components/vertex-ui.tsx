import type { ReactNode } from "react";

type IconName = "bell" | "search" | "play" | "play-filled" | "document" | "bookmark" | "signal" | "clock" | "user" | "chevron" | "chevron-left" | "chevron-down" | "external" | "check-circle" | "lock" | "folder" | "eye" | "grid" | "target" | "accessibility";

export function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  const shapes: Record<IconName, ReactNode> = {
    bell: <><path d="M5 16h14l-2-2V9a5 5 0 0 0-10 0v5l-2 2Z"/><path d="M10 19a2 2 0 0 0 4 0"/></>,
    search: <><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></>,
    play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 5 4-5 4V8Z"/></>,
    "play-filled": <><circle cx="12" cy="12" r="9" fill="currentColor" stroke="none"/><path d="m10 8 5 4-5 4V8Z" fill="white" stroke="white"/></>,
    document: <><path d="M6 2.5h8l4 4V21H6V2.5Z"/><path d="M14 2.5V7h4M9 11h6M9 15h6"/></>,
    bookmark: <path d="M6 3.5h12V21l-6-4-6 4V3.5Z"/>,
    signal: <><rect x="4" y="15" width="3" height="5" rx=".5"/><rect x="10" y="11" width="3" height="9" rx=".5"/><rect x="16" y="6" width="3" height="14" rx=".5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    user: <><circle cx="12" cy="8" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2H5Z"/></>,
    chevron: <path d="m9 5 7 7-7 7"/>,
    "chevron-left": <path d="m15 5-7 7 7 7"/>,
    "chevron-down": <path d="m5 9 7 7 7-7"/>,
    external: <><path d="M13 5h6v6M19 5l-9 9"/><path d="M18 14v5H5V6h5"/></>,
    "check-circle": <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></>,
    folder: <path d="M3 6h7l2 2h9v11H3V6Z"/>,
    eye: <><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    grid: <><rect x="2" y="2" width="9" height="9" rx="1"/><rect x="13" y="2" width="9" height="9" rx="1"/><rect x="2" y="13" width="9" height="9" rx="1"/><rect x="13" y="13" width="9" height="9" rx="1"/></>,
    target: <><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="m14 10 7-7"/></>,
    accessibility: <><circle cx="12" cy="3.5" r="1.5"/><path d="M4 8c5 2 11 2 16 0M12 9v12M12 13l-5 8M12 13l5 8"/></>,
  };
  return <svg aria-hidden="true" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{shapes[name]}</svg>;
}

export function VertexLogo({ size = "small" }: { size?: "small" | "large" }) {
  return <div className={`vertex-logo vertex-logo-${size}`} aria-label="Vertex"><svg aria-hidden="true" viewBox="0 0 40 40" fill="none"><path d="M2 4h36L20 36 2 4Z" fill="#E9551D"/><path d="M11 10h18L20 27 11 10Z" fill="white"/><path d="M20 10h9l-4.5 8H20v-8Z" fill="#E9551D"/></svg><span>Vertex</span></div>;
}

export function Badge({ kind, children }: { kind: "video" | "lesson" | "popular"; children: ReactNode }) {
  return <span className={`vertex-badge badge-${kind}`}>{children}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="vertex-progress" role="progressbar" aria-label="Course progress" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${Math.min(100, Math.max(0, value))}%` }} /></div>;
}

export function Button({ variant, disabled = false, hover = false, children, icon }: {
  variant: "primary" | "secondary" | "tertiary" | "text";
  disabled?: boolean;
  hover?: boolean;
  children: ReactNode;
  icon?: "external" | "play";
}) {
  return <button className={`sample-button ${variant}${hover ? " hover-sample" : ""}`} disabled={disabled} type="button"><span>{children}</span>{icon && <Icon name={icon} size={12} />}</button>;
}
