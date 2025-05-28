"use client";

import { Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteService from "@/components/shared/delete-service";
import { Badge } from "@/components/ui/badge";
import { useQueryClient } from "@tanstack/react-query";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";

interface AddressCardProps {
  address: UserAddress;
  onEdit: () => void;
}

export function AddressCard({ address, onEdit }: AddressCardProps) {
  const queryClient = useQueryClient();

  const onSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["fetchData", "/address"],
    });

    toast.success("Address saved successfully");
  };

  const { mutate, isPending } = useSubmitData(
    `/address/setDefault/${address.id}`,
    onSuccess,
    (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    }
  );
  const handleSetDefault = () => {
    mutate({ data: {}, type: "put" });
  };

  return (
    <Card className="overflow-hidden relative transition-all hover:shadow-md rounded-2xl">
      <CardContent className="p-6">
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">{address.fullName}</h3>
          <div className="space-y-1">
            <p className="text-sm">{address.fullAddress}</p>
            <p className="text-sm">{address.specificAddress}</p>
            <p className="text-sm text-muted-foreground">
              {address.phoneNumber}
            </p>
          </div>
        </div>
        {address.isDefault && (
          <Badge
            className="absolute top-2 right-2 border-amber-300"
            variant="outline"
          >
            Default
          </Badge>
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0 border-t bg-muted/10">
        <Button
          variant="ghost"
          className="text-blue-500"
          size="sm"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>

        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSetDefault}
            disabled={isPending}
          >
            Set as Default
          </Button>
        )}

        {!address.isDefault && (
          <DeleteService
            isTrigger
            endpoint={`/address/${address.id}`}
            queryKey="/address"
          >
            <Button variant="ghost" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DeleteService>
        )}
      </CardFooter>
    </Card>
  );
}
