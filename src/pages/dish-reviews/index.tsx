import { useParams, useSearchParams } from "react-router-dom";
import FilterBar from "./components/filter-bar";
import ReviewItem from "./components/review-item";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import axios from "@/api/axios";
import { AmberLoading } from "@/components/shared/amber-loading";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import useFetchData from "@/hooks/useFetchData";
import useSetTitle from "@/hooks/useSetTitle";

export default function DishReviews() {
  useSetTitle("Dish Reviews");

  const { id } = useParams<{ id: string }>();

  const [params] = useSearchParams();

  const { ref, inView } = useInView();

  const {
    data: statics,
    isLoading: isStaticsLoading,
    isError: isStaticsError,
  } = useFetchData(`/review/dish/${id}/statics`, "", "normal");

  const { data, isLoading, isError, fetchNextPage, isFetchingNextPage } =
    useInfiniteScroll(axios, `/review/dish/${id}`, params);

  useEffect(() => {
    if (inView && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, isFetchingNextPage]);

  if (isLoading || isStaticsLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <AmberLoading text="Loading reviews..." size="md" />
      </div>
    );
  if (isError || isStaticsError) return <div>Error loading reviews.</div>;

  const reviewData = data?.pages.flatMap((page) => page.content) || [];

  return (
    <section className="px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="my-3">
          <h1 className="text-2xl text-amber-500 tracking font-bold">
            Dish Reviews
          </h1>
          <p className="text-gray-500">Reviews for dish</p>
        </div>
        <FilterBar
          totalReviews={statics.totalRating}
          averageRating={statics.averageRating}
        />

        <div className="flex flex-col space-y-8  border border-amber-300 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
          {reviewData.map((review, index) => (
            <ReviewItem review={review} key={index} />
          ))}

          <div ref={ref} />

          {isFetchingNextPage && (
            <div className="flex justify-center items-center h-16">
              <AmberLoading text="Loading more reviews..." size="md" />
            </div>
          )}

          {reviewData.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                No reviews found
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Be the first to review this dish!
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
