import { Control, Path } from "react-hook-form";
import { FieldValues } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { cn } from "@/lib/utils";
import { MultiSelect } from "../ui/multi-select";

type RenderFormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  title?: string;
  control: Control<T>;
  valueKey?: string;
  displayKey?: string;
  options: any[];
  className?: string;
  labelClassName?: string;
  placeholder?: string;
  type?: "key-value" | "value" | "multi" | "checkbox";
};

const RenderFormSelect = <T extends FieldValues>({
  name,
  title,
  control,
  options,
  labelClassName,
  className,
  valueKey,
  displayKey,
  placeholder,
  type = "key-value",
}: RenderFormSelectProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          {title && (
            <FormLabel className={cn(labelClassName)}>{title}</FormLabel>
          )}
          {type === "multi" ? (
            <FormControl>
              <MultiSelect
                options={options}
                onValueChange={field.onChange}
                defaultValue={field.value}
                placeholder="Select"
                variant="inverted"
              />
            </FormControl>
          ) : (
            <>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                defaultValue={field.value}
              >
                <FormControl className="mb-2">
                  <SelectTrigger className="w-[100%]">
                    <SelectValue placeholder={placeholder || "Select"} />
                  </SelectTrigger>
                </FormControl>
                {(() => {
                  switch (type) {
                    case "key-value":
                      return (
                        <SelectContent>
                          {options.length > 0 ? (
                            options.map((option, idx) => (
                              <SelectItem
                                value={
                                  valueKey ? option[valueKey].toString() : ""
                                }
                                key={idx.toString()}
                              >
                                {displayKey && option[displayKey]
                                  ? option[displayKey].toString()
                                  : ""}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="">
                              No options available
                            </SelectItem>
                          )}
                        </SelectContent>
                      );
                    case "value":
                      return (
                        <SelectContent>
                          {options.length > 0 ? (
                            options.map((option, idx) => (
                              <SelectItem value={option.toString()} key={idx}>
                                {option.toString()}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem disabled value="">
                              No options available
                            </SelectItem>
                          )}
                        </SelectContent>
                      );

                    default:
                      return null;
                  }
                })()}
              </Select>
            </>
          )}

          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default RenderFormSelect;
