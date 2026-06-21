import {
  useDraggable,
} from "@dnd-kit/core";

export default function LeadCard({
  lead,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
  } = useDraggable({
    id: lead._id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px,0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-gray-50 dark:bg-zinc-800 rounded-xl p-4 cursor-grab shadow"
    >
      <h3 className="font-semibold">
        {lead.name}
      </h3>

      <p className="text-sm text-gray-500">
        {lead.email}
      </p>

      {lead.property && (
        <p className="text-xs mt-2">
          {
            lead.property
              .title
          }
        </p>
      )}

      <div className="mt-3 text-xs capitalize">
        Priority:
        {" "}
        {lead.priority}
      </div>
    </div>
  );
}