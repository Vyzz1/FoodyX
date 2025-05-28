import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PhoneIcon } from "lucide-react";
import ChangeAddress from "./change-address";
import { useEffect, useState } from "react";
import { useCheckout } from "@/hooks/use-checkout";

interface AddressDisplayProps {
  addresses: UserAddress[];
}

const AddressDisplay = ({ addresses }: AddressDisplayProps) => {
  const [currentAddress, setCurrentAddress] = useState<UserAddress>(
    addresses.find((address) => address.isDefault)!
  );

  const { setAddress } = useCheckout();

  useEffect(() => {
    setAddress(currentAddress.id);
  }, [setAddress, currentAddress.id]);

  return (
    <div className="w-full">
      <div className=" border  md:flex-row flex-col flex justify-between items-start w-full border-amber-400 rounded-xl shadow-sm px-4 py-3 gap-y-3">
        <div className="space-y-2">
          <h2 className="text-lg text-slate-900 font-semibold dark:text-white ">
            {currentAddress?.fullName}
          </h2>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-slate-500" />
            <span className="text-sm text-slate-500 dark:text-gray-200 font-medium">
              {currentAddress?.phoneNumber}
            </span>
          </div>
          <div>{currentAddress?.fullAddress}</div>
          <div>
            <Separator className="w-2 h-2" orientation="vertical" />
            <span className="text-sm text-slate-500 font-medium dark:text-gray-200">
              {currentAddress?.specificAddress}
            </span>
          </div>
        </div>
        <ChangeAddress
          setNewAddress={setCurrentAddress}
          trigger={
            <Button className="bg-amber-500 hover:bg-amber-600 shadow-md text-white ">
              Change Address
            </Button>
          }
          address={addresses}
        />
      </div>
    </div>
  );
};

export default AddressDisplay;
