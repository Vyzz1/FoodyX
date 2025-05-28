import { AmberLoading } from "@/components/shared/amber-loading";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import useFetchData from "@/hooks/useFetchData";
import { useNavigate, useParams } from "react-router-dom";
import { OrderItems } from "../../components/shared/order-items";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

interface UserOrder {
  id: string;
  items: any[];
  orderDate: string;
  currentStatus: string;
}

interface OrderModalProps {
  apiEndpoint: string;
  backTo: string;
}

const OrderModal = ({ apiEndpoint, backTo }: OrderModalProps) => {
  const { id } = useParams();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      navigate(backTo);
    }
  };

  const {
    data: orders,
    isLoading,
    isError,
  } = useFetchData(`/${apiEndpoint}/${id}`, "", "normal");

  if (isError) {
    return <div>Error</div>;
  }

  const handleViewDetails = (orderId: string) => {
    queryClient.setQueryData(
      ["fetchData", `/order/${orderId}`],
      orders.find((order: any) => order.id === orderId)
    );
    navigate(`/order/${orderId}`, {});
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[90vw] max-h-[80vh] overflow-y-scroll sm:w-[500px]">
        <DialogTitle>Orders </DialogTitle>

        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <AmberLoading text="Loading Orders..." size="md" />
          </div>
        )}

        {!isLoading && orders?.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p>No orders found for this user.</p>
          </div>
        )}

        <div className="flex flex-col gap-4 mt-4">
          {orders?.map((order: UserOrder) => (
            <OrderItems
              shouldRepay={false}
              isAdmin
              items={order.items}
              key={order.id}
              orderDate={order.orderDate}
              onViewDetails={() => {
                handleViewDetails(order.id);
              }}
              currentStatus={order.currentStatus}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderModal;
