import DeleteService from "@/components/shared/delete-service";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSubmitData from "@/hooks/useSubmitData";
import { useQueryClient } from "@tanstack/react-query";
import {
  CircleOff,
  EyeIcon,
  MoreHorizontalIcon,
  Trash,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

interface RowActionProps {
  id: string;
  isBanned: boolean;
}

export function RowActions({ id, isBanned }: RowActionProps) {
  const [params] = useSearchParams();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate, isPending } = useSubmitData(
    `/user/${!isBanned ? "ban" : "unban"}/${id}`,
    () => {
      queryClient.invalidateQueries({
        queryKey: ["fetchData", `/user/get-all-user?${params.toString()}`],
      });
      toast.success("Updated successfully");
    },
    () => {
      toast.error("Error updating user");
    }
  );
  const handleBanUser = () => {
    mutate({ data: {}, type: "patch" });
  };

  return (
    <DeleteService
      endpoint={`/user/${id}`}
      queryKey={`/user/get-all-user?${params.toString()}`}
    >
      <DropdownMenu >
        <DropdownMenuTrigger>
          <Button variant="ghost" size="sm" className="hover:bg-amber-200">
            <MoreHorizontalIcon />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={()=>{
              navigate(`${id}/orders`);

            }}>
              <EyeIcon className="mr-2 h-4 w-4" />
              View Orders
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* <DropdownMenuItem>
            <Edit2Icon className="mr-2 h-4 w-4" />
            Update User
          </DropdownMenuItem> */}

          <DropdownMenuItem disabled={isPending} onClick={handleBanUser}>
            <CircleOff className="mr-2 h-4 w-4" />
            {isBanned ? "Unban User" : "Ban User"}
          </DropdownMenuItem>

          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="text-red-500">
              <Trash className="mr-2 h-4 w-4 text-red-500" />
              Delete User
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteService>
  );
}
