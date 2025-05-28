import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import RatingModal from "./rating-modal";

interface RatingSelectionProps {
  orderItems: OrderItem[];
}

const RatingSelection: React.FC<RatingSelectionProps> = ({ orderItems }) => {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<OrderItem>();

  function handleClick(item: OrderItem) {
    setSelected(item);
    setTimeout(() => {
      setModalOpen(true);
    }, 300);
  }

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <Button 
            onClick={()=>{
                if(orderItems.length === 1 && !orderItems[0].isRated) {
                 handleClick(orderItems[0]);
                }
            }}
            variant="outline"
            size="sm"
            className="border-amber-200 hover:bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
          >
            Review
          </Button>
        </PopoverTrigger>

        {orderItems.length > 1 && (
          <PopoverContent>
            {orderItems
              .filter((o) => !o.isRated)
              .map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 mt-4"
                  onClick={() => handleClick(item)}
                >
                  <h3 className="text-sm cursor-pointer hover:text-amber-700 font-semibold text-amber-600 dark:text-amber-300">
                    Rate for {item.menuItemName}
                  </h3>
                </div>
              ))}
          </PopoverContent>
        )}
      </Popover>

      {selected && (
        <RatingModal
          visible={modalOpen}
          setVisible={setModalOpen}
          order={selected!}
        />
      )}
    </>
  );
};

export default RatingSelection;