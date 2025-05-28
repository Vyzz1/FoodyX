import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddressDialog } from "@/pages/user-address/components/address-dialog";
import { Edit3Icon } from "lucide-react";
import React from "react";

const AddressItem = ({
  address,
  isChecked,
  onChange,
  setNewAddress,
}: {
  address: UserAddress;
  isChecked: boolean;
  setNewAddress?: (address: UserAddress) => void;
  onChange?: (id: string) => void;
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex gap-2 items-start px-5 w-full">
      <Checkbox
        checked={isChecked}
        onCheckedChange={() => {
          if (onChange) {
            onChange(address.id);
          }
        }}
        className="data-[state=checked]:bg-amber-500 dark:data-[state=checked]:bg-amber-500 mt-2"
      />
      <div className="flex w-full justify-between items-center border-b border-slate-300 pb-2">
        <div className="space-y-2 w-full">
          <div className="flex justify-between w-full items-center ">
            <h2 className="text-lg leading-none text-slate-900 dark:text-white font-semibold ">
              {address.fullName}
            </h2>
            <Button size={"sm"} variant="link" onClick={() => setIsOpen(true)}>
              Edit
              <Edit3Icon className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500 font-medium dark:text-muted-foreground">
              {address.phoneNumber}
            </span>
          </div>
          <div className="w-full">{address.fullAddress}</div>
          <div>
            <span className="text-sm text-slate-500 font-medium">
              {address.specificAddress}
            </span>
          </div>
        </div>
      </div>
      <AddressDialog
        open={isOpen}
        onSuccess={(data) => {
          if (isChecked && setNewAddress) {
            setNewAddress(data);
          }
        }}
        onOpenChange={setIsOpen}
        title="Edit Address"
        isEdit
        defaultValues={address}
      />
    </div>
  );
};

interface ChangeAddressProps {
  trigger: React.ReactNode;
  address: UserAddress[];
  setNewAddress?: (address: UserAddress) => void;
}

const ChangeAddress: React.FC<ChangeAddressProps> = ({
  trigger,
  address,
  setNewAddress,
}) => {
  const [isAddressOpen, setIsAddressOpen] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const [currentAddress, setCurrentAddress] = React.useState(
    address.find((item) => item.isDefault)?.id || ""
  );

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto  ">
          <div>
            <Button
              size={"sm"}
              variant="ghost"
              onClick={() => setIsAddressOpen(true)}
              className="text-slate-800 dark:text-slate-200"
            >
              Add Address
              <Edit3Icon className="h-4 w-4 ml-2" />
            </Button>
          </div>
          <div className="flex flex-col gap-4">
            {address.map((item) => (
              <AddressItem
                setNewAddress={setNewAddress}
                onChange={setCurrentAddress}
                isChecked={currentAddress === item.id}
                key={item.id}
                address={item}
              />
            ))}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsOpen(false);

                if (setNewAddress) {
                  const selectedAddress = address.find(
                    (item) => item.id === currentAddress
                  );
                  if (selectedAddress) {
                    setNewAddress(selectedAddress);
                  }
                }
              }}
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 shadow-md"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddressDialog
        open={isAddressOpen}
        onOpenChange={setIsAddressOpen}
        title="Add Address"
        isEdit={false}
      />
    </>
  );
};

export default ChangeAddress;
