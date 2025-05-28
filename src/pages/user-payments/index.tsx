import { AmberLoading } from "@/components/shared/amber-loading";
import DateRangeFilter from "@/components/shared/date-range-filter";
import useFetchData from "@/hooks/useFetchData";
import useSetTitle from "@/hooks/useSetTitle";
import ToolbarPaymentFilter from "../../components/shared/toollbar-payment-filter";
import { paymentColumns } from "./components/user-paymentColumns";
import { DataTableServerSide } from "@/components/shared/data-table-serverside";
import { useSearchParams } from "react-router-dom";

import PaymentCards from "@/components/shared/payment-cards";

export default function UserPayments() {
  useSetTitle("Your Payments");

  const [params] = useSearchParams();
  const {
    data: payments,
    isLoading,
    isError,
  } = useFetchData(`/payment/me?${params}`, "", "private");

  if (isError) {
    return <div>Error loading orders</div>;
  }

  return (
    <section className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex lg:items-center justify-between mb-6 flex-col lg:flex-row items-start">
          <h1 className="admin-title">Your Payments</h1>
          <DateRangeFilter />
        </div>

        <PaymentCards isLoading={isLoading} payments={payments} />

        {isLoading ? (
          <div className="flex justify-center items-center mt-8">
            <AmberLoading />
          </div>
        ) : (
          <>
            <ToolbarPaymentFilter />
            <DataTableServerSide
              pagination={{
                isLast: payments.isLast,
                isPrevious: payments.isPrevious,
                isNext: payments.isNext,
                totalPages: payments.totalPages,
                currentPage: payments.currentPage,
                limit: payments.pageSize,
                totalCount: payments.totalCount,
              }}
              columns={paymentColumns}
              data={payments.content}
            />
          </>
        )}
      </div>
    </section>
  );
}
