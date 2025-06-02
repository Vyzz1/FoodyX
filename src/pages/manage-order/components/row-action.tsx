import { useNavigate, useSearchParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteService from "@/components/shared/delete-service";
import { Button } from "@/components/ui/button";
import { Edit, EyeIcon, MoreHorizontalIcon, Trash } from "lucide-react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ChangeOrderStatus from "../../../components/shared/change-order-status";
import { DialogTrigger } from "@/components/ui/dialog";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
interface RowActionProps {
  id: string;
  currentStatus: string;
  queryKey: string[];
}
const RowAction = ({ id, currentStatus, queryKey }: RowActionProps) => {
  const navigator = useNavigate();

  const queryClient = useQueryClient();
  const [params] = useSearchParams();
  const toastIdRef = useRef<string | number | null>(null);

  const { mutate, isPending, isSuccess } = useSubmitData(
    `/order/${id}`,
    () => {
      queryClient.invalidateQueries({
        queryKey: queryKey,
      });
      toast.dismiss();
    },
    (error: any) => {
      const message = error?.response?.data?.message || "An error occurred.";
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
        toastIdRef.current = null;
      }
      toast.error(message);
    }
  );

  // Handle loading state
  useEffect(() => {
    if (isPending && !toastIdRef.current) {
      toastIdRef.current = toast.loading("Changing order status...");
    }
  }, [isPending]);

  // Handle success state
  useEffect(() => {
    if (isSuccess && toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toast.success("Order status changed successfully");
      toastIdRef.current = null;
    }
  }, [isSuccess]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (toastIdRef.current) {
        toast.dismiss(toastIdRef.current);
      }
    };
  }, []);

  return (
    <ChangeOrderStatus
      isFinish={isSuccess}
      loading={isPending}
      currentStatus={currentStatus}
      onChangeStatus={(newStatus) => {
        mutate({ data: { status: newStatus }, type: "patch" });
      }}
    >
      <DeleteService
        endpoint={`/order/${id}`}
        queryKey={`/order/admin?${params}`}
      >
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="ghost" size="sm" className="hover:bg-amber-200">
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => {
                  navigator(`/order/${id}`);
                }}
              >
                <EyeIcon className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>

              <DialogTrigger>
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  Change Status
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-500">
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete Order
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </DeleteService>
    </ChangeOrderStatus>
  );
};

export default RowAction;
