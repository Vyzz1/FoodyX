import { DataTableFacetedFilter } from "@/components/shared/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { CheckCircle2, CircleX } from "lucide-react";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

interface ToolbarPaymentFilterProps {
  isAdmin?: boolean;
}

const ToolbarPaymentFilter = ({ isAdmin }: ToolbarPaymentFilterProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = React.useState<string>(
    searchParams.get("keyword") || ""
  );

  const debouncedKeyword = useDebounce(keyword, 500);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedKeyword && debouncedKeyword.length > 0) {
      newParams.set("keyword", debouncedKeyword);
    } else {
      newParams.delete("keyword");
    }
    setSearchParams(newParams);
  }, [debouncedKeyword, searchParams, setSearchParams]);
  return (
    <div className="flex md:flex-row  flex-col  md:justify-between text-md  gap-y-4 md:items-center py-4">
      {isAdmin && (
        <Input
          placeholder={`Phone, customer name, or order ID`}
          value={keyword}
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParams);
            setSearchParams(newParams);
            setKeyword(event.target.value);
          }}
          className="max-w-xs placeholder:capitalize "
        />
      )}
      <div className="flex items-center gap-x-2">
        {Array.from(searchParams.entries()).length > 0 && (
          <Button
            size={"sm"}
            variant="outline"
            className="hidden md:inline-flex"
            onClick={() => {
              setSearchParams(new URLSearchParams());
              setKeyword("");
            }}
          >
            Clear All
          </Button>
        )}

        <DataTableFacetedFilter
          options={[
            {
              label: "Success",
              value: "Success",
              icon: CheckCircle2,
            },
            {
              label: "Failed",
              value: "Failed",
              icon: CircleX,
            },
          ]}
          paramKey="statuses"
          title="Status"
        />
      </div>
    </div>
  );
};

export default ToolbarPaymentFilter;
