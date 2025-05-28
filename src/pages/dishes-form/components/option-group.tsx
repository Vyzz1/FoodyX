"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { PlusIcon, Trash2Icon } from "lucide-react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useFieldArray, useFormContext } from "react-hook-form";
import { useState } from "react";
import type { Dish } from "../schema";
import RenderFormField from "@/components/form/render-form-field";
import { SortableOptionItem } from "./sortable-option-item";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface OptionItemProps {
  index: number;
  onRemove: (index: number) => void;
}

const OptionGroup = ({ index, onRemove }: OptionItemProps) => {
  const form = useFormContext<Dish>();

  const [required, setRequired] = useState(
    form.watch(`optionGroups.${index}.required`) || false
  );
  const [multiple, setMultiple] = useState(
    form.watch(`optionGroups.${index}.multiple`) || false
  );

  const { fields, remove, append, move } = useFieldArray({
    name: `optionGroups.${index}.options`,
    control: form.control,
  });

  const name = form.watch(`optionGroups.${index}.name`);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);

      move(oldIndex, newIndex);

      // Update sequence numbers
      const updatedFields = arrayMove(fields, oldIndex, newIndex);
      updatedFields.forEach((_, idx) => {
        form.setValue(`optionGroups.${index}.options.${idx}.sequence`, idx + 1);
      });
    }
  };

  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={`optionsGroup-${index}`} className="">
        <AccordionTrigger className="w-full flex justify-between px-4">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-base font-medium">
              {name ? `#${index + 1} ${name}` : `Option Group ${index + 1}`}{" "}
            </h3>
            <span className="text-amber-500">
              {required ? "Required" : "Optional"}
            </span>
          </div>
        </AccordionTrigger>

        <AccordionContent className="space-y-5 p-8 border rounded-lg">
          <div className="flex items-center justify-end">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => onRemove(index)}
            >
              <Trash2Icon className="cursor-pointer size-5 text-amber-500" />
            </Button>
          </div>

          <RenderFormField
            control={form.control}
            name={`optionGroups.${index}.id`}
            type="input"
            inputClassName="hidden"
          />

          <RenderFormField
            control={form.control}
            name={`optionGroups.${index}.sequence`}
            type="input"
            inputClassName="hidden"
          />

          <FormField
            control={form.control}
            name={`optionGroups.${index}.name`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="option name"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`optionGroups.${index}.required`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Is this option required?</FormLabel>
                  <FormDescription>
                    Customers must select an option.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      if (multiple && value) {
                        form.setValue(`optionGroups.${index}.multiple`, false);
                        setMultiple(false);
                      }

                      setRequired(value);

                      if (value == true) {
                        form.setValue(`optionGroups.${index}.freeLimit`, 0);
                      }

                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`optionGroups.${index}.multiple`}
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>
                    Allow customers to select multiple options?
                  </FormLabel>

                  <FormDescription>
                    Customers can select multiple options
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={(value) => {
                      if (required && value) {
                        form.setValue(`optionGroups.${index}.required`, false);
                        setRequired(false);
                      }

                      setMultiple(value);

                      field.onChange(value);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch(`optionGroups.${index}.multiple`) && (
            <RenderFormField
              name={`optionGroups.${index}.freeLimit`}
              inputType="number"
              title="Free Limit"
              placeholder="Enter free limit"
              control={form.control}
              type="input"
            />
          )}

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                optionName: "",
                sequence: fields.length + 1,
                additionalPrice: 0,
              });
            }}
            size={"sm"}
          >
            <PlusIcon />
            Add Item
          </Button>

          {form.formState.errors.optionGroups?.find?.((_, idx) => idx === index)
            ?.options?.root?.message && (
            <p className="text-red-500 text-sm">
              {
                form.formState.errors.optionGroups?.find?.(
                  (_, idx) => idx === index
                )?.options?.root?.message
              }
            </p>
          )}

          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={fields.map((field) => field.id)}
                strategy={verticalListSortingStrategy}
              >
                {fields.map((field, idx) => (
                  <SortableOptionItem
                    key={field.id}
                    id={field.id}
                    index={idx}
                    parentIndex={index}
                    onRemove={() => remove(idx)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default OptionGroup;
