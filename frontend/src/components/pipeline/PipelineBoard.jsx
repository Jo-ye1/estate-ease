import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core";

import PipelineColumn from "./PipelineColumn";
import { moveLead } from "../../services/pipelineService";
import { useAuth } from "../../context/AuthContext";

const stages = [
  "new",
  "contacted",
  "viewing",
  "negotiation",
  "offer",
  "contract",
  "closed",
  "lost",
];

export default function PipelineBoard({
  pipeline,
  setPipeline,
}) {
  const { user } = useAuth();

  const handleDragEnd = async (
    event
  ) => {
    const { active, over } = event;

    if (!over) return;

    const leadId = active.id;
    const stage = over.id;

    if (
      !stages.includes(stage)
    )
      return;

    const clone =
      JSON.parse(
        JSON.stringify(pipeline)
      );

    let movedLead = null;

    stages.forEach((s) => {
      clone[s] = clone[s].filter(
        (lead) => {
          if (lead._id === leadId) {
            movedLead = lead;
            return false;
          }

          return true;
        }
      );
    });

    if (!movedLead) return;

    movedLead.pipelineStage = stage;

    clone[stage].push(movedLead);

    setPipeline(clone);

    try {
      await moveLead(
        leadId,
        stage,
        user.token
      );
    } catch (err) {
      console.log(err);
    }
  };

return (
    <DndContext
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-8 gap-4 overflow-x-auto p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl">
        {stages.map((stage) => (
          <PipelineColumn
            key={stage}
            id={stage}
            title={stage}
            leads={pipeline[stage] || []}
          />
        ))}
      </div>
    </DndContext>
  );
}
