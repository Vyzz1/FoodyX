import useFetchData from "@/hooks/useFetchData";
import AccountCard from "./components/account-card";
import useSetTitle from "@/hooks/useSetTitle";

const UserAccount = () => {
  useSetTitle("Your Account");
  const { data, isLoading, error } = useFetchData("/user/me", "", "private");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div>Error loading user account.</div>;
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-xl mx-auto  ">
        <AccountCard user={data} />
      </div>
    </section>
  );
};

export default UserAccount;
