import useFetchData from "@/hooks/useFetchData";
import FoodSection from "./food-section";

const FoodDisplay = () => {
  const { data, isLoading, isError } = useFetchData(
    "/food/homepage",
    "",
    "normal"
  );
  if (isError) {
    return (
      <section className="px-4 py-8 ">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-2xl font-bold">
            Error fetching data
          </h1>
        </div>
      </section>
    );
  }

  return (
    <div className="mt-12 space-y-8">
      <FoodSection
        isLoading={isLoading}
        title="Popular Food"
        food={data?.bestSellings || []}
      />

      <FoodSection
        isLoading={isLoading}
        title="Highest Rated Food"
        food={data?.mostRated || []}
      />
    </div>
  );
};

export default FoodDisplay;
