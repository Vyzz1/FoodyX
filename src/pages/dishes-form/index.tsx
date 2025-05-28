"use client";

import FormProvider from "@/components/form/form-provider";
import RenderFormField from "@/components/form/render-form-field";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader, PlusIcon } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { type Dish, dishSchema } from "./schema";
import { ImageUploadDialog } from "@/components/shared/image-upload-dialog";
import React, { useState } from "react";
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
import { SortableOptionGroup } from "./components/sortable-option-group";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import {
  updateImagesWithServerUrls,
  uploadFilesInOrder,
} from "@/lib/images-upload";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useFetchData from "@/hooks/useFetchData";
import RenderFormSelect from "@/components/form/render-form-select";
import useSetTitle from "@/hooks/useSetTitle";

interface DishFormProps {
  initialData?: Dish;

  isEdit: boolean;

  id?: string;
}

const DishForm: React.FC<DishFormProps> = ({
  initialData,
  id,
  isEdit = false,
}) => {
  const {
    data: categories,
    isLoading,
    isError,
  } = useFetchData("/category", "", "normal");

  useSetTitle(isEdit ? "Edit Dish " : "Create new Dish");

  const form = useForm({
    resolver: zodResolver(dishSchema),
    defaultValues: initialData,
  });

  const [isUploading, setIsUploading] = useState(false);

  const { fields, append, remove, move } = useFieldArray({
    name: "optionGroups",
    control: form.control,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((item) => item.id === active.id);
      const newIndex = fields.findIndex((item) => item.id === over.id);

      move(oldIndex, newIndex);

      const updatedFields = arrayMove(fields, oldIndex, newIndex);
      updatedFields.forEach((_, index) => {
        form.setValue(`optionGroups.${index}.sequence`, index + 1);
      });
    }
  };

  const endpoint = isEdit ? `/food/${id}` : "/food";

  const { mutate, isPending } = useSubmitData(
    endpoint,
    (data) => {
      console.log(data);
      toast.success("Data submitted successfully");
    },
    () => {
      toast.error("Error submitting data");
    }
  );

  const [images, setImages] = useState<string[]>(initialData?.images || []);

  const [blobToFileMap, setBlobToFileMap] = useState<Map<string, File>>();

  const axios = useAxiosPrivate({ type: "upload" });

  const onSubmit = async (data: Dish) => {
    try {
      const blobUrls = Array.from(images).filter((url) =>
        url.startsWith("blob:")
      );

      const orderedFiles: File[] = [];
      const blobToIndexMap = new Map<string, number>();

      setIsUploading(true);
      blobUrls.forEach((blobUrl) => {
        const file = blobToFileMap!.get(blobUrl);
        if (file) {
          const index = images.indexOf(blobUrl);
          blobToIndexMap.set(blobUrl, index);
          orderedFiles.push(file);
        }
      });

      const uploadedUrls =
        (orderedFiles.length > 0 &&
          (await uploadFilesInOrder(orderedFiles, axios))) ||
        [];

      const blobToServerUrlMap = new Map<string, string>();
      blobUrls.forEach((blobUrl, i) => {
        if (i < uploadedUrls.length) {
          blobToServerUrlMap.set(blobUrl, uploadedUrls[i]);
        }
      });

      const finalImages = updateImagesWithServerUrls(
        images,
        blobToServerUrlMap
      );

      setImages(finalImages);

      data.images = finalImages;

      return mutate({ data: data, type: isEdit ? "patch" : "post" });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsUploading(false);
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading categories.</div>;
  }

  console.log(form.formState.errors);

  const isProcessing = isUploading || isPending;

  return (
    <section className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-amber-400 text-2xl font-semibold">
          Menu Item Form
        </h2>

        <p className="text-muted-foreground my-2 text-sm">
          Fill out the form below to {isEdit ? "update" : "create"} a new menu
          item.
        </p>

        <div className="flex items-center justify-end my-4">
          <ImageUploadDialog
            existingImages={images}
            onSave={(images, blobToFileMap) => {
              setImages(images);
              setBlobToFileMap(blobToFileMap);
            }}
            trigger={
              <Button type="button" variant="outline">
                <ImageIcon className="mr-2" />({images.length}) Upload Images
              </Button>
            }
          />
        </div>

        <FormProvider
          form={form}
          className="space-y-5 mt-8"
          onSubmit={onSubmit}
        >
          <RenderFormField
            name="name"
            inputType="text"
            title="Name"
            placeholder="Enter name"
            control={form.control}
            type="input"
          />

          <div className="grid md:grid-cols-2 gap-3 grid-cols-1">
            <RenderFormSelect
              name="categoryId"
              title="Category"
              placeholder="Select category"
              type="key-value"
              control={form.control}
              options={categories}
              valueKey="id"
              displayKey="name"
            />

            <RenderFormField
              name="timeEstimate"
              title="Time to Prepare"
              placeholder="Enter time to prepare"
              control={form.control}
              type="input"
              inputType="number"
            />
          </div>

          <RenderFormField
            name="description"
            inputType="text"
            title="Description"
            placeholder="Enter description"
            control={form.control}
            type="textarea"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <RenderFormField
              name="costPrice"
              inputType="number"
              title="Cost Price"
              placeholder="Enter cost price"
              control={form.control}
              isDecimal
              type="input"
            />
            <RenderFormField
              isDecimal
              name="sellingPrice"
              inputType="number"
              title="Selling Price"
              placeholder="Enter selling price"
              control={form.control}
              type="input"
            />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              append({
                name: "",
                required: false,
                multiple: false,
                sequence: fields.length + 1,
                freeLimit: 0,
                options: [],
              });
            }}
            size={"sm"}
          >
            <PlusIcon /> Add Options Group
          </Button>

          <div className="space-y-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              {/** Lấy danh sách đã sắp xếp để sử dụng chung */}
              {(() => {
                const sortedFields = [...fields].sort(
                  (a, b) => a.sequence - b.sequence
                );
                return (
                  <SortableContext
                    items={sortedFields.map((field) => field.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {sortedFields.map((field, index) => (
                      <SortableOptionGroup
                        key={field.id}
                        id={field.id}
                        index={index}
                        onRemove={() => remove(index)}
                      />
                    ))}
                  </SortableContext>
                );
              })()}
            </DndContext>
          </div>

          <Button disabled={isProcessing}>
            {isProcessing && <Loader className="mr-2 animate-spin" />}
            {isProcessing ? "Submitting..." : "Submit"}
          </Button>
        </FormProvider>
      </div>
    </section>
  );
};

export default DishForm;
