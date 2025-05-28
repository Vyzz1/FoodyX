import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OptionGroup from "./option-group";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableOptionGroupProps {
  id: string;
  index: number;
  onRemove: () => void;
}

export function SortableOptionGroup({
  id,
  index,
  onRemove,
}: SortableOptionGroupProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        className="absolute -left-2 top-1 cursor-grab p-2 text-muted-foreground hover:text-foreground z-10"
        {...attributes}
        {...listeners}
      >
        <Button
          variant="ghost"
          size="icon"
          className="cursor-grab"
          type="button"
        >
          <GripVertical className="h-5 w-5" />
        </Button>
      </div>
      <div className="pl-8">
        <OptionGroup index={index} onRemove={onRemove} />
      </div>
    </div>
  );
}
