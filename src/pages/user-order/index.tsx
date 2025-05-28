import { AmberLoading } from "@/components/shared/amber-loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { OrderItems } from "../../components/shared/order-items";
import { useDebounce } from "@/hooks/useDebounce";
import { useInView } from "react-intersection-observer";
import { OrderItemsSkeleton } from "./components/order-items-skeleton";
import { useQueryClient } from "@tanstack/react-query";
import useSetTitle from "@/hooks/useSetTitle";

const UserOrder = () => {
  useSetTitle("Your Orders");

  const [parms, setParams] = useSearchParams();
  const [activeStatus, setActiveStatus] = useState(
    parms.get("status") || "All"
  );

  const [searchQuery, setSearchQuery] = useState(parms.get("keyword") || "");
  const [sortBy, setSortBy] = useState(parms.get("sort") || "newest");

  const debouncedValue = useDebounce(searchQuery, 500);

  function handleSetNewParams(key: string, value: string) {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev.toString());
      newParams.set(key, value);
      return newParams;
    });
  }

  function handleDeleteParams(key: string) {
    setParams((prev) => {
      const newParams = new URLSearchParams(prev.toString());
      newParams.delete(key);
      return newParams;
    });
  }

  const handleStatusChange = (value: string) => {
    setActiveStatus(value);
    handleSetNewParams("status", value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);

    handleSetNewParams("keyword", event.target.value);

    if (event.target.value === "") {
      handleDeleteParams("keyword");
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    handleSetNewParams("sort", value);
  };

  const navigate = useNavigate();

  const axios = useAxiosPrivate({ type: "normal" });

  const queryClient = useQueryClient();

  const { data, isLoading, fetchNextPage, isFetchingNextPage, isError } =
    useInfiniteScroll(
      axios,
      "/order/me",
      new URLSearchParams({
        status: activeStatus,
        keyword: debouncedValue,
        sort: sortBy!,
      })
    );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [fetchNextPage, inView]);

  function handleResetFilters() {
    setActiveStatus("All");
    setSearchQuery("");
    setSortBy("newest");
    setParams(new URLSearchParams({}));
  }
  const orderList =
    data?.pages.flatMap((page: { content: any }) => page.content) || [];

  const handleViewDetails = (orderId: string) => {
    queryClient.setQueryData(
      ["fetchData", `/order/${orderId}`],
      orderList.find((order: any) => order.id === orderId)
    );
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage and track your customer orders
        </p>
      </div>

      <div className="flex flex-col space-y-4">
        <Tabs
          defaultValue="all"
          value={activeStatus}
          onValueChange={handleStatusChange}
          className="w-full overflow-x-auto"
        >
          <TabsList className="w-full justify-start">
            <TabsTrigger value="All" className="flex-shrink-0">
              All
            </TabsTrigger>
            <TabsTrigger value="Pending" className="flex-shrink-0">
              Pending
            </TabsTrigger>
            <TabsTrigger value="Processing" className="flex-shrink-0">
              Processing
            </TabsTrigger>
            <TabsTrigger value="Shipped" className="flex-shrink-0">
              Shipped
            </TabsTrigger>
            <TabsTrigger value="Delivered" className="flex-shrink-0">
              Delivered
            </TabsTrigger>
            <TabsTrigger value="Cancelled" className="flex-shrink-0">
              Cancelled
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by order #, customer name or email..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <div className="w-full sm:w-[250px] flex-shrink-0">
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="lg:w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest first</SelectItem>
                <SelectItem value="oldest">Oldest first</SelectItem>
                <SelectItem value="highest">Price: High to low</SelectItem>
                <SelectItem value="lowest">Price: Low to high</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {isError && (
        <div className="flex items-center justify-center py-12 text-center">
          <SlidersHorizontal className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-medium">Error fetching orders</h3>
          <p className="text-muted-foreground mt-1">Please try again later.</p>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <OrderItemsSkeleton key={index} itemCount={2} />
            ))}
        </div>
      )}

      {orderList.length == 0 && !isLoading && !isError && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <SlidersHorizontal className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No orders found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={handleResetFilters}
          >
            Reset filters
          </Button>
        </div>
      )}

      {orderList.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {orderList.map((order) => (
            <OrderItems
              shouldRepay={
                order.paymentMethod !== "cod" && order.payStatus === "Failed"
              }
              orderId={order.id}
              onViewDetails={() => {
                handleViewDetails(order.id);
              }}
              currentStatus={order.currentStatus}
              orderDate={order.orderDate}
              key={order.id}
              items={order.items}
            />
          ))}
        </div>
      )}

      <div ref={ref}></div>

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <AmberLoading className="h-10 w-10" />
        </div>
      )}
    </div>
  );
};

export default UserOrder;
