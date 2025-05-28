import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Btn03 from "@/components/ui/btn03";

interface HeroSectionProps {
  foodItems: {
    name: string;
    imageUrl: string;
  }[];
}

export default function HeroSection({ foodItems }: HeroSectionProps) {
  const [currentFoodIndex, setCurrentFoodIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFoodIndex((prev) => (prev + 1) % foodItems.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [foodItems.length]);

  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const handleSearch = () => {
    if (search.trim() === "") {
      return;
    }
    navigate(`/filter-food?search=${search}`);

    setSearch("");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotate: -10 },
    visible: {
      scale: 1,
      opacity: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        duration: 0.5,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      rotate: 10,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="relative overflow-hidden bg-background">
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br  opacity-10 blur-3xl -z-10`}
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{
          duration: 8,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "reverse",
        }}
      />

      <div className="container px-4 py-16 md:py-24 lg:py-32 mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            className="flex flex-col space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-2">
              <motion.div
                className="inline-block px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                #1 Food Delivery App
              </motion.div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight"
            >
              Delicious Food
              <motion.span
                className="block text-amber-500"
                animate={{
                  scale: [1, 1.05, 1],
                  color: ["#f59e0b", "#d97706", "#f59e0b"],
                }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
              >
                Delivered Fast
              </motion.span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg text-muted-foreground max-w-md"
            >
              Order your favorite meals from the best restaurants in your area
              and enjoy a quick delivery to your doorstep.
            </motion.p>

            <motion.div variants={itemVariants} className="relative">
              <div className="flex items-center space-x-2 bg-background rounded-lg border shadow-sm p-1.5">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search for food..."
                    className="pl-9 border-none shadow-none focus-visible:ring-0 text-xs md:text-sm"
                  />
                </div>
                <Btn03 onClick={handleSearch}>
                  Find Food <ArrowRight className="ml-2 h-4 w-4" />
                </Btn03>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-amber-500" />
                <span>100+ cities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-amber-500" />
                <span>30 min average delivery</span>
              </div>
            </motion.div>
          </motion.div>

          <div className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
            <motion.div
              className="absolute inset-0 bg-gradient-radial from-transparent to-background/80 z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={currentFoodIndex}
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="relative z-20"
              >
                <div className="relative">
                  <motion.div
                    className="absolute -inset-4 rounded-full bg-gradient-to-r from-amber-500/20 to-amber-400/10 blur-xl"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  />
                  <img
                    src={
                      foodItems[currentFoodIndex].imageUrl || "/placeholder.svg"
                    }
                    alt={foodItems[currentFoodIndex].name}
                    className="relative z-10 rounded-3xl size-72  md:size-96 object-cover"
                  />

                  <motion.div
                    className="absolute top-4 right-4 z-20 bg-background/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border"
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    <span className="font-bold text-amber-600">
                      {foodItems[currentFoodIndex].name}
                    </span>
                  </motion.div>

                  <motion.div
                    className="absolute -bottom-2 -left-2 z-20 bg-amber-500 text-white rounded-full px-4 py-2 shadow-lg"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                  >
                    <span className="font-bold">Order Now</span>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            <motion.div
              className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-amber-500/20 backdrop-blur-sm z-0"
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            />

            <motion.div
              className="absolute bottom-1/4 right-1/3 w-8 h-8 rounded-full bg-amber-400/20 backdrop-blur-sm z-0"
              animate={{
                y: [0, 20, 0],
                x: [0, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY }}
            />

            <motion.div
              className="absolute top-1/3 right-1/4 w-6 h-6 rounded-full bg-yellow-500/20 backdrop-blur-sm z-0"
              animate={{
                y: [0, -10, 0],
                x: [0, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
