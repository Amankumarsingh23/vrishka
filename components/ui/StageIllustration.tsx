import type { Stage } from "@/types/flower";
import { STAGE_ILLUSTRATION_STROKE } from "@/lib/stages";

function LeafPair({ y, spread, curl }: { y: number; spread: number; curl: number }) {
  return (
    <>
      <path d={`M50,${y} C${50 - curl},${y - 4} ${50 - spread},${y - 2} ${50 - spread - 4},${y + 4} C${50 - curl},${y + 8} ${50 - 4},${y + 6} 50,${y} Z`} />
      <path d={`M50,${y} C${50 + curl},${y - 4} ${50 + spread},${y - 2} ${50 + spread + 4},${y + 4} C${50 + curl},${y + 8} ${50 + 4},${y + 6} 50,${y} Z`} />
    </>
  );
}

function GroundLine() {
  return <line x1="26" y1="82" x2="74" y2="82" />;
}

function Seed() {
  return (
    <>
      <GroundLine />
      <ellipse cx="50" cy="78" rx="12" ry="7" transform="rotate(-10 50 78)" />
      <path d="M44,78 Q50,74 56,78" />
    </>
  );
}

function Sprout() {
  return (
    <>
      <GroundLine />
      <ellipse cx="50" cy="81" rx="9" ry="5" />
      <path d="M50,81 C50,73 50,68 50,64" />
      <LeafPair y={66} spread={10} curl={4} />
    </>
  );
}

function Seedling() {
  return (
    <>
      <GroundLine />
      <path d="M50,82 C50,70 50,58 50,50" />
      <LeafPair y={64} spread={16} curl={6} />
      <LeafPair y={52} spread={9} curl={4} />
    </>
  );
}

function LeafyPlant() {
  return (
    <>
      <GroundLine />
      <path d="M50,82 C50,66 50,48 50,30" />
      <LeafPair y={70} spread={18} curl={7} />
      <LeafPair y={56} spread={16} curl={6} />
      <LeafPair y={40} spread={11} curl={5} />
    </>
  );
}

function Bud() {
  return (
    <>
      <GroundLine />
      <path d="M50,82 C50,64 50,46 50,30" />
      <LeafPair y={68} spread={17} curl={7} />
      <LeafPair y={52} spread={12} curl={5} />
      <ellipse cx="50" cy="24" rx="7" ry="10" />
      <path d="M45,32 L47,26" />
      <path d="M55,32 L53,26" />
    </>
  );
}

function FullBloom() {
  const petals = Array.from({ length: 6 }, (_, i) => i * 60);
  return (
    <>
      <GroundLine />
      <path d="M50,82 C50,64 50,46 50,32" />
      <LeafPair y={68} spread={17} curl={7} />
      <LeafPair y={54} spread={12} curl={5} />
      <g>
        {petals.map((angle) => (
          <ellipse key={angle} cx="50" cy="14" rx="4.5" ry="9" transform={`rotate(${angle} 50 22)`} />
        ))}
      </g>
      <circle cx="50" cy="22" r="3.5" />
    </>
  );
}

const STAGE_ART: Record<Stage, () => JSX.Element> = {
  Dormant: Seed,
  Germinated: Sprout,
  Seedling: Seedling,
  Vegetative: LeafyPlant,
  Budding: Bud,
  Flowering: FullBloom,
};

export function StageIllustration({
  stage,
  size = 86,
  className,
}: {
  stage: Stage;
  size?: number;
  className?: string;
}) {
  const Art = STAGE_ART[stage];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      stroke={STAGE_ILLUSTRATION_STROKE}
      strokeWidth={2.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={stage === "Dormant" ? { opacity: 0.55 } : undefined}
      aria-hidden="true"
    >
      <Art />
    </svg>
  );
}
