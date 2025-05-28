import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Star } from "lucide-react";
import { useState } from "react";
import {  useSearchParams } from "react-router-dom";
interface FilterBarProps {
    totalReviews: number;
    averageRating: number;
}

export default function FilterBar({totalReviews,averageRating}:FilterBarProps) {

    const [params,setParams]=useSearchParams();
    const [selected, setSelected] = useState(params.get("filterBy") || "all");

    const [sortBy, setSortBy] = useState(params.get("sortBy") || "CREATED_AT_DESC");


    const handleSelectedChange = (value: string) => {
        if(value.trim() === "") {
            setSelected("all")
        }
        setSelected(value);

        const newParams = new URLSearchParams(params.toString());
        newParams.set("filterBy", value);
        setParams(newParams);
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        const newParams = new URLSearchParams(params.toString());
        newParams.set("sortBy", value);
        setParams(newParams);
    }

    const filterOptions = [
        {
            label: "All",
            value: "all",
        },{
            label:"5 Star",
            value:"5_STAR",
        },
        {
            label:"4 Star",
            value:"4_STAR",
        },
        {
            label:"3 Star",
            value:"3_STAR",
        },
        {
            label:"2 Star",
            value:"2_STAR",
        },
        {
            label:"1 Star",
            value:"1_STAR",
        },{
            label:"Has Images",
            value:"HAS_IMAGES",

        }
    ]

  return (
    
    <div className="flex  flex-col space-y-8 bg-neutral-100 border border-amber-300 dark:bg-gray-800 p-4 rounded-lg shadow-md mb-4">
     <div className="flex w-full items-center justify-between ">
     <div className="flex items-center gap-x-3">
            <h1 className="text-3xl font-bold text-yellow-500 dark:text-white">
               {averageRating.toFixed(1)}
            </h1>

            <Star className="size-8 text-yellow-500 fill-current"  />
            <span className="text-gray-500 dark:text-gray-400">
                {totalReviews} reviews
            </span>
        </div>

        <div className="flex items-center gap-x-3">
            <span className="text-black dark:text-gray-400">Sort by:</span>
          
            <Select  value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] dark:border-stone-100">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="CREATED_AT_DESC">Latest</SelectItem>
                    <SelectItem value="CREATED_AT_ASC">Oldest</SelectItem>
                    
                </SelectContent>
            </Select>

            </div>
     </div>

    <ToggleGroup 
    value={selected}
    onValueChange={handleSelectedChange}
    type="single" className="w-full gap-3 grid grid-cols-2 sm:grid-cols-3 lg:flex " defaultValue="all">
        {filterOptions.map((option) => (
            <ToggleGroupItem
                key={option.value}
                value={option.value}
                className="data-[state=on]:bg-amber-500 data-[state=on]:text-white border border-amber-300 rounded-2xl"
            >
                {option.label}
            </ToggleGroupItem>
        ))}

    </ToggleGroup>
    </div>
  )
}
