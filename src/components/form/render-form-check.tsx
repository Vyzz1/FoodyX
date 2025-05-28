import { Control, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";

type RenderFormCheckProps<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  control: Control<T>;
  className?: string;
  labelClassName?: string;
  description?: string;
  type: "checkbox" | "radio" | "switch";
  onValueChange?: (value: boolean) => void;
};
const RenderFormCheck = <T extends FieldValues>({
  name,
  title,
  control,
  className,
  labelClassName,
  description,
  type,
  onValueChange,
}: RenderFormCheckProps<T>) => {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={cn("w-full", className)}>
          <div>
            <FormLabel className={labelClassName}>{title}</FormLabel>
            <FormDescription>{description}</FormDescription>
          </div>
          {type === "switch" && (
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={(value) => {
                  if (onValueChange) {
                    onValueChange(value);
                  }

                  field.onChange(value);
                }}
              />
            </FormControl>
          )}
          {/* {type ==="checkbox" && (

          )} */}
        </FormItem>
      )}
    />
  );
};

export default RenderFormCheck;
