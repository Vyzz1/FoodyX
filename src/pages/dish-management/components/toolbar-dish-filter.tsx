import { DataTableFacetedFilter } from "@/components/shared/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import useFetchData from "@/hooks/useFetchData";
import {
  CheckCircle,
  LoaderPinwheel,
} from "lucide-react";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ToolbarFoodFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = React.useState<string>(
    searchParams.get("search") || ""
  );

  const {isLoading,isError,data} = useFetchData("/category","","normal");

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedKeyword && debouncedKeyword.length > 0) {
      newParams.set("search", debouncedKeyword);
    } else {
      newParams.delete("search");
    }
    setSearchParams(newParams);
  }, [debouncedKeyword, searchParams, setSearchParams]);
  return (
    <div className="flex md:flex-row  flex-col  md:justify-between text-md  gap-y-4 md:items-center py-4">
      {
        <Input
          placeholder={`Name, Description`}
          value={keyword}
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("page");
            setSearchParams(newParams);
            setKeyword(event.target.value);
          }}
          className="max-w-xs placeholder:capitalize "
        />
      }

      <div className="flex items-center gap-x-2">
        {Array.from(searchParams.entries()).length > 0 && (
          <Button
            size={"sm"}
            variant="outline"
            className="hidden md:inline-flex"
            onClick={() => {
              setSearchParams(new URLSearchParams());
            }}
          >
            Clear All
          </Button>
        )}
      {!isLoading && !isError && data.length > 0 && (
          <DataTableFacetedFilter
            options={data.map((item :Category) => ({
              label: item.name,
              value: item.id,
              
            }))}
            paramKey="categoriesIds"
            title="Category"
          />
      )}

        <DataTableFacetedFilter
          options={[
            { label: "Active", value: "true", icon: CheckCircle },
            {
              label: "Inactive",
              value: "false",
              icon: LoaderPinwheel,
            },
          
          ]}
          paramKey="isActives"
          title="Status"
        />
      </div>
    </div>
  );
};

export default ToolbarFoodFilter;
