import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import AutoComplete from "./auto-complete";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

interface ChooseAutoCompleteProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  name: Path<T>;
}

const AddressInput = <T extends FieldValues>({
  form,
  name,
}: ChooseAutoCompleteProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Address</FormLabel>
          <FormControl>
            <AutoComplete
              {...field}
              className="max-w-full"
              defaultValue={field.value}
              onSelect={(value) => {
                if (value === null) {
                  field.onChange("");
                  return;
                }
                field.onChange(value.description);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default AddressInput;
