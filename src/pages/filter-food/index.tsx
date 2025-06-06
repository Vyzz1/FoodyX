import { FilterBar } from "./components/filter-bar";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import axios from "@/api/axios";
import { useSearchParams } from "react-router-dom";
import { AmberLoading } from "@/components/shared/amber-loading";
import FoodGallery from "./components/food-gallery";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export default function FilterFood() {
  const [params] = useSearchParams();
  const { ref, inView } = useInView();

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } =
    useInfiniteScroll(axios, "/food/filter", params);

  useEffect(() => {
    if (inView) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Error loading data</h1>
      </div>
    );
  }

  // const foods = isLoading ? [] : data!.pages.flatMap((page) => page.content);

  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="my-5 space-y-2">
          <h1 className="md:text-4xl text-2xl text-transparent tracking-tight bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-600 font-semibold">
            Find Your Favorite Food
          </h1>
          <p className="text-amber-500 dark:text-stone-200">
            Discover our exquisite selection of culinary masterpieces, crafted
            with passion and the finest ingredients
          </p>
        </div>

        <FilterBar />

        <FoodGallery
          isLoading={isLoading}
          foods={
            isLoading ? [] : data?.pages.flatMap((page) => page.content) || []
          }
        />

        <div ref={ref} />

        {isFetchingNextPage && (
          <div className="flex items-center justify-center my-4">
            <AmberLoading />
          </div>
        )}
      </div>
    </section>
  );
}
