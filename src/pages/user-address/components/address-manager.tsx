import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddressCard } from "./address-card";
import { AddressDialog } from "./address-dialog";

interface AddressManagerProps {
  userAddresses: UserAddress[];
}

export function AddressManager({ userAddresses }: AddressManagerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );

  const handleEditClick = (address: UserAddress) => {
    setEditingAddress(address);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">
          {userAddresses.length}{" "}
          {userAddresses.length === 1 ? "address" : "addresses"} saved
        </p>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Address
        </Button>
      </div>

      {userAddresses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {userAddresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => handleEditClick(address)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">
            You don't have any saved addresses yet
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Your First Address
          </Button>
        </div>
      )}

      <AddressDialog
        isEdit={false}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        title="Add New Address"
      />

      {editingAddress && (
        <AddressDialog
          open={!!editingAddress}
          onOpenChange={(open) => !open && setEditingAddress(null)}
          title="Edit Address"
          isEdit
          defaultValues={editingAddress}
        />
      )}
    </div>
  );
}
