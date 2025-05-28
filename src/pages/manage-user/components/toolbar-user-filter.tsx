import { DataTableFacetedFilter } from "@/components/shared/data-table-faceted-filter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function ToolBarUserFilter() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = React.useState<string>(
    searchParams.get("search") || ""
  );

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
    <div className=" mb-8 space-y-5">
      <div className="flex justify-between items-center">
        <h2 className="admin-title ">Manage Users</h2>
      </div>

      <div className="flex items-center justify-between space-x-4">
        <Input
          value={keyword}
          onChange={(event) => {
            const newParams = new URLSearchParams(searchParams);
            setSearchParams(newParams);
            setKeyword(event.target.value);
          }}
          type="text"
          className="max-w-xs placeholder:capitalize "
          placeholder="Search by name or email"
        />
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
            paramKey="emailConfirmed"
            title="Email Verified"
            options={[
              { value: "true", label: "Verified" },
              { value: "false", label: "Not Verified" },
            ]}
          />

          <DataTableFacetedFilter
            paramKey="isBanned"
            title="User Status"
            options={[
              { value: "true", label: "Banned" },
              { value: "false", label: "Active" },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
