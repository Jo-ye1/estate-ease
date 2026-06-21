import { useDroppable } from "@dnd-kit/core";
import LeadCard from "./LeadCard";

export default function PipelineColumn({
  id,
  title,
  leads,
}) {
  const { setNodeRef } =
    useDroppable({
      id,
    });

  return (
    <div
      ref={setNodeRef}
      className="bg-white dark:bg-zinc-900 rounded-xl p-3 min-h-[600px]"
    >
      <div className="font-semibold mb-4 capitalize">
        {title} ({leads.length})
      </div>

      <div className="space-y-3">
        {leads.map((lead) => (
          <LeadCard
            key={lead._id}
            lead={lead}
          />
        ))}
      </div>
    </div>
  );
}