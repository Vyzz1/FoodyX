import useFetchData from "@/hooks/useFetchData";
import { AddressManager } from "./components/address-manager";
import useSetTitle from "@/hooks/useSetTitle";

const UserAddress = () => {
  const {
    data: addresses,
    isLoading,
    isError,
  } = useFetchData("/address", "", "private");

  useSetTitle("Your addresses");
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error</div>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-semibold text-slate-800 tracking-tight mb-6 dark:text-slate-200">
        Manage Your Addresses
      </h1>
      <AddressManager userAddresses={addresses} />
    </div>
  );
};

export default UserAddress;
