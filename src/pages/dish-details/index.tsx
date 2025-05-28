import { AmberLoading } from "@/components/shared/amber-loading";
import useFetchData from "@/hooks/useFetchData";
import { Link, useParams } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Slash,
  Star,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import OptionGroupHover from "./components/option-group-hover";
import AddToCart from "./components/add-to-card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
const DishDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const {
    data: dish,
    isError,
    isLoading,
  } = useFetchData(`/food/${id}`, "", "normal");

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <AmberLoading text="Loading dish..." size="md" />
      </div>
    );

  if (isError) return <div>Error loading dish.</div>;
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % dish.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + dish.images.length) % dish.images.length
    );
  };

  return (
    <section className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="my-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink>Food</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator>
                <Slash />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <BreadcrumbPage>{dish.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative rounded-xl overflow-hidden bg-amber-50 shadow-md  h-fit  ">
            <div className="relative  w-full h-full overflow-hidden">
              <img
                src={dish.images[currentImageIndex] || "/placeholder.svg"}
                alt={dish.name}
                className="size-full object-cover transition-all duration-500 hover:scale-105"
              />

              {dish.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6 text-amber-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6 text-amber-600" />
                  </button>
                </>
              )}
            </div>

            {dish.images.length > 1 && (
              <div className="flex justify-center gap-2 py-2">
                {dish.images.map((_: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "h-3 w-3 rounded-full transition-all duration-200",
                      currentImageIndex === idx
                        ? "bg-amber-600 scale-125"
                        : "bg-amber-300 hover:bg-amber-400"
                    )}
                    aria-label={`View image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-amber-100 dark:text-black text-amber-800 rounded-full text-sm font-medium">
                  {dish.category.name}
                </span>
                <div className="flex items-center ml-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= dish.averageRating
                          ? "fill-current text-amber-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                  <Link to={`/dish/${dish.id}/reviews`}>
                    <Button variant="link" className="ml-2">
                      {dish.totalRating} reviews
                    </Button>
                  </Link>

                  <p className="text-sm text-amber-400 font-semibold dark:text-muted-foreground ml-2">
                    {dish.soldCount} sold
                  </p>
                </div>
              </div>

              <h1 className="text-3xl dark:text-amber-300 md:text-4xl font-bold text-gray-900">
                {dish.name}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-muted-foreground">
                {dish.description}
              </p>
            </div>
            <div className="flex justify-between px-1.5 items-center">
              <span className="text-3xl font-bold text-amber-600">
                ${dish.sellingPrice.toFixed(2)}
              </span>

              <AddToCart
                menuItemId={dish.id}
                basePrice={dish.sellingPrice}
                optionGroups={dish.optionGroups}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                <Award className="w-5 h-5 text-amber-600 mr-3" />
                <div>
                  <h4 className="font-medium dark:text-black">
                    Premium Quality
                  </h4>
                  <p className="text-sm text-gray-600">
                    Locally sourced ingredients
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600 mr-3" />
                <div>
                  <h4 className="font-medium dark:text-black">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">30 minutes or less</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-amber-50 rounded-lg">
                <Flame className="w-5 h-5 text-amber-600 mr-3" />
                <div>
                  <h4 className="font-medium dark:text-black">Hot & Fresh</h4>
                  <p className="text-sm text-gray-600">Prepared on order</p>
                </div>
              </div>
            </div>

            <OptionGroupHover optionGroups={dish.optionGroups} />
          </div>
        </div>
      </div>
      <Helmet>
        <title>{dish.name}</title>
        <meta
          name="description"
          content={`Order ${dish.name} from FoodyX. Enjoy delicious food delivered fast. ${dish.description}`}
        />
        <meta
          name="keywords"
          content={`${dish.name}, food delivery, delicious food, fast delivery, FoodyX`}
        />
        <meta name="author" content="VyHuynh" />

        <meta property="og:title" content={dish.name} />
        <meta
          property="og:description"
          content={`Order ${dish.name} from FoodyX. Enjoy delicious food delivered fast. ${dish.description}`}
        />
        <meta
          property="og:image"
          content={dish.images[0] || "/placeholder.svg"}
        />
        <link rel="canonical" href={`https://example.com/dish/${id}`} />
        <meta property="og:url" content={`https://example.com/dish/${id}`} />
      </Helmet>
    </section>
  );
};

export default DishDetails;
