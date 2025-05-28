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
import { EyeIcon, MoreHorizontalIcon, Trash } from "lucide-react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
interface RowActionProps {
  orderId: string;
  paymentId: string;
}
const RowAction = ({ orderId, paymentId }: RowActionProps) => {
  const navigator = useNavigate();

  const [params] = useSearchParams();

  return (
    <DeleteService
      endpoint={`/payment/${paymentId}`}
      queryKey={`/payment/all?${params}`}
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
                navigator(`/order/${orderId}`);
              }}
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              View Order Details
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-500">
              <Trash className="mr-2 h-4 w-4 text-red-500" />
              Delete Payment
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteService>
  );
};

export default RowAction;
