import RenderFormField from "@/components/form/render-form-field";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Trash2Icon } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Dish } from "../schema";

const OptionItem = ({
  index,
  onRemove,
  parentIndex,
}: {
  index: number;
  parentIndex: number;
  onRemove: () => void;
}) => {
  const form = useFormContext<Dish>();
  if (!form) {
    throw new Error("Form context is required");
  }

  const name = form.watch(
    `optionGroups.${parentIndex}.options.${index}.optionName`
  );
  return (
    <Accordion type="single" collapsible key={index}>
      <AccordionItem
        value={`optionGroups.${parentIndex}.options.${index}.optionName`}
      >
        <AccordionTrigger>
          <div className="flex items-center justify-between w-full">
            <h3 className="text-base font-medium">
              {name ? `#${index + 1} ${name}` : `Item ${index + 1}`}
            </h3>
          </div>
        </AccordionTrigger>

        <AccordionContent className="space-y-5 p-8 border rounded-lg">
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={onRemove}
            >
              <Trash2Icon className="cursor-pointer size-5 text-amber-500" />
            </Button>
          </div>

          <RenderFormField
            control={form.control}
            name={`optionGroups.${parentIndex}.options.${index}.id`}
            type="input"
            inputClassName="hidden"
          />

          <RenderFormField
            control={form.control}
            name={`optionGroups.${parentIndex}.options.${index}.sequence`}
            type="input"
            inputClassName="hidden"
          />
          <FormField
            control={form.control}
            name={`optionGroups.${parentIndex}.options.${index}.optionName`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Item Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="option name"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <RenderFormField
            name={`optionGroups.${parentIndex}.options.${index}.additionalPrice`}
            inputType="number"
            title="Additional Price"
            placeholder="Enter additional price"
            control={form.control}
            type="input"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default OptionItem;
