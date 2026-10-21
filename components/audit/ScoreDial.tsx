/**
 * The overall score as a quiet three-quarter ring on the 1.0–4.0 scale, with
 * hairline ticks where the bands change (2.0, 2.8, 3.5).
 */
const START = 135; // degrees; the ring opens at the bottom
const SWEEP = 270;

function point(r: number, deg: number) {
  const rad = (deg * Math.PI) / 180;
  return [60 + r * Math.cos(rad), 60 + r * Math.sin(rad)];
}
function arc(r: number, from: number, to: number) {
  const [x1, y1] = point(r, from);
  const [x2, y2] = point(r, to);
  return `M ${x1} ${y1} A ${r} ${r} 0 ${to - from > 180 ? 1 : 0} 1 ${x2} ${y2}`;
}
const angleFor = (s: number) =>
  START + (SWEEP * (Math.min(4, Math.max(1, s)) - 1)) / 3;

export default function ScoreDial({
  score,
  band,
  size = 220,
}: {
  score: number | null;
  band: string | null;
  size?: number;
}) {
  const end = score === null ? START : angleFor(score);
  return (
    <figure
      className="relative mx-auto"
      style={{ width: size, height: size }}
      aria-label={
        score === null
          ? "No overall score"
          : `Overall score ${score.toFixed(1)} out of 4.0: ${band}`
      }
      role="img"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} aria-hidden>
        <path
          d={arc(52, START, START + SWEEP)}
          fill="none"
          stroke="var(--color-rule)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {score !== null && score > 1 && (
          <path
            d={arc(52, START, end)}
            fill="none"
            stroke="var(--color-oxblood)"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="audit-dial-fill"
          />
        )}
        {[2.0, 2.8, 3.5].map((t) => {
          const [x1, y1] = point(47, angleFor(t));
          const [x2, y2] = point(57, angleFor(t));
          return (
            <line
              key={t}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--color-paper)"
              strokeWidth="1.2"
            />
          );
        })}
      </svg>
      <figcaption className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-serif text-ink leading-none"
          style={{ fontSize: size * 0.27 }}
        >
          {score === null ? "—" : score.toFixed(1)}
        </span>
        <span className="eyebrow mt-2 text-grey">out of 4.0</span>
      </figcaption>
    </figure>
  );
}
