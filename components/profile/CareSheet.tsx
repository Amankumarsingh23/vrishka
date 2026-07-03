import type { Flower } from "@/types/flower";

export function CareSheet({ flower }: { flower: Flower }) {
  const fields = [
    { label: "Sow Method", value: flower.sowMethod },
    { label: "Sun Needs", value: flower.sunNeeds },
    { label: "Watering", value: flower.wateringRule },
    { label: "Germination", value: flower.expectedGerminationDays },
    { label: "Disease Risk", value: flower.diseaseRisk },
  ];

  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-card">
      <h2 className="font-serif text-h3 text-ink">Care Sheet</h2>
      <dl className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((field) => (
          <div key={field.label}>
            <dt className="font-sans text-caption uppercase text-muted">{field.label}</dt>
            <dd className="mt-1 font-sans text-sm text-body">{field.value}</dd>
          </div>
        ))}
      </dl>
      {flower.note && (
        <p className="mt-5 border-l-[3px] border-gold pl-4 font-serif text-[15px] italic text-body">
          {flower.note}
        </p>
      )}
    </div>
  );
}
