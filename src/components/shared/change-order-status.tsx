import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStatusClassName } from "@/lib/utils";
import { useState } from "react";

const statusPriority: Record<string, number> = {
  Pending: 1,
  Processing: 2,
  Shipped: 3,
  Delivered: 4,
  Cancelled: 5,
};

interface ChangeStatusProps {
  currentStatus: string;
  onChangeStatus: (status: string) => void;
  children?: React.ReactNode;
  isTrigeer?: boolean;
  loading?: boolean;
}

const ChangeOrderStatus = ({
  currentStatus,
  onChangeStatus,
  isTrigeer,
  children,
  loading = false,
}: ChangeStatusProps) => {
  const [open, setOpen] = useState(false);

  const isStatusDisabled = (status: string) => {
    if (currentStatus === "Delivered" && status === "Cancelled") {
      return true;
    }

    return statusPriority[status] < statusPriority[currentStatus];
  };

  const handleStatusChange = (status: string) => {
    onChangeStatus(status);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isTrigeer ? <DialogTrigger>{children}</DialogTrigger> : children}
      <DialogContent>
        <Select
          disabled={loading}
          onValueChange={handleStatusChange}
          defaultValue={currentStatus}
        >
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            {Object.keys(statusPriority).map((status) => (
              <SelectItem
                key={status}
                value={status}
                disabled={isStatusDisabled(status)}
              >
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={getStatusClassName(status)}
                  >
                    {status}
                  </Badge>
                  {isStatusDisabled(status) && (
                    <span className="text-gray-400 text-xs">(Not allowed)</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeOrderStatus;
