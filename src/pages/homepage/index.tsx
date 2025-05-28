import useSetTitle from "@/hooks/useSetTitle";
import HeroSection from "./components/hero-section";
import useFetchData from "@/hooks/useFetchData";
import { AmberLoading } from "@/components/shared/amber-loading";
import FoodDisplay from "./components/food-display";
import { Spotlight } from "@/components/ui/spotlight";
import { useTheme } from "@/layout/theme-provider";

const Homepage = () => {
  useSetTitle("FoodyX - Delicious Food Delivery");

  const { theme } = useTheme();

  const {
    data: categories,
    isLoading,
    isError,
  } = useFetchData("/category", "", "private");

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

  if (isLoading) {
    return (
      <section className="px-4 py-8 ">
        <div className="max-w-7xl mx-auto min-h-screen flex items-center justify-center">
          <AmberLoading />
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-8 ">
      <div className="max-w-7xl mx-auto">
        {theme === "dark" && <Spotlight fill="#cb9526" className=" top-25 " />}
        <HeroSection foodItems={categories || []} />
        <FoodDisplay />
      </div>
    </section>
  );
};

export default Homepage;
