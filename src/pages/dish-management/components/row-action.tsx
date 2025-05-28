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
import {
  Edit,
  EyeIcon,
  ImagesIcon,
  MoreHorizontalIcon,
  Trash,
} from "lucide-react";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
interface RowActionProps {
  id: string;
  name?: string;
}
const RowAction = ({ id, name }: RowActionProps) => {
  const navigator = useNavigate();

  const [params] = useSearchParams();

  return (
    <DeleteService endpoint={`/food/${id}`} queryKey={`/food?${params}`}>
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
                navigator(`/dish/${id}`);
              }}
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                navigator(`/admin/dishes/edit/${id}`);
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>

            <AlertDialogTrigger asChild>
              <DropdownMenuItem className="text-red-500">
                <Trash className="mr-2 h-4 w-4 text-red-500" />
                Delete
              </DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => {
              navigator(`${id}/orders`, { state: { dishId: id } });
            }}
          >
            <EyeIcon className="mr-2 h-4 w-4" />
            View Dish Order
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => {
              navigator(`${id}/update-image`, {
                state: { dishId: id, dishName: name },
              });
            }}
          >
            <ImagesIcon className="mr-2 h-4 w-4" />
            Update Images
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </DeleteService>
  );
};

export default RowAction;
