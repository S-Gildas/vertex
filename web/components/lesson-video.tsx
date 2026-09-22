export function LessonVideo({ videoId, start }: { videoId: string | null; start: number }) {
  if (!videoId) return <div className="lesson-video-unavailable">Video is unavailable for this lesson.</div>;

  const embed = new URL(`https://www.youtube.com/embed/${videoId}`);
  embed.searchParams.set("rel", "0");
  if (start > 0) embed.searchParams.set("start", String(start));

  return <div className="lesson-video">
    <iframe src={embed.toString()} title="Lesson video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
  </div>;
}
