import { DataTableServerSide } from "@/components/shared/data-table-serverside";
import useFetchData from "@/hooks/useFetchData";
import { Outlet, useSearchParams } from "react-router-dom";
import { columns } from "./components/user-columns";
import ToolBarUserFilter from "./components/toolbar-user-filter";
import { AmberLoading } from "@/components/shared/amber-loading";
import useSetTitle from "@/hooks/useSetTitle";

const ManageUser = () => {
  const [params] = useSearchParams();

  useSetTitle("Manage Users");
  const {
    data: users,
    isLoading,
    isError,
  } = useFetchData(`/user/get-all-user?${params}`, "", "private");

  if (isError) {
    return <div>Error loading users</div>;
  }

  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <AmberLoading />
          </div>
        ) : (
          <>
            <ToolBarUserFilter />
            <DataTableServerSide
              data={users.content}
              columns={columns}
              pagination={{
                isLast: users.isLast,
                isPrevious: users.isPrevious,
                isNext: users.isNext,
                totalPages: users.totalPages,
                currentPage: users.currentPage,
                totalCount: users.totalCount,
                limit: users.pageSize,
              }}
            />
          </>
        )}
      </div>

      <Outlet />
    </section>
  );
};

export default ManageUser;
