import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import OptionItem from "./option-item";
import { GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SortableOptionItemProps {
  id: string;
  index: number;
  parentIndex: number;
  onRemove: () => void;
}

export function SortableOptionItem({
  id,
  index,
  parentIndex,
  onRemove,
}: SortableOptionItemProps) {
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
        className="absolute -left-4  top-1 cursor-grab p-2 text-muted-foreground hover:text-foreground z-10"
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
        <OptionItem
          index={index}
          parentIndex={parentIndex}
          onRemove={onRemove}
        />
      </div>
    </div>
  );
}
