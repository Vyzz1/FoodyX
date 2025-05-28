import FormProvider from "@/components/form/form-provider";
import RenderFormField from "@/components/form/render-form-field";
import { Button } from "@/components/ui/button";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSetTitle from "@/hooks/useSetTitle";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, PlusSquareIcon, Trash } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export default function UploadImages() {
  const { id } = useParams<{ id: string }>();

  useSetTitle("Update Food Images");

  const { state } = useLocation();
  const formSchema = z.object({
    images: z.array(z.string().url()).min(1, "At least one image is required"),
  });

  type FormDataType = z.infer<typeof formSchema>;

  const form = useForm<FormDataType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      images: ["https://example.com/image2.jpg"],
    },
  });

  const [loading, setLoading] = useState(false);
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = "";
      }
    },
    [loading]
  );
  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const { remove, append, fields } = useFieldArray({
    control: form.control,
    name: "images" as unknown as never,
  });
  const axiosPrivate = useAxiosPrivate({ type: "normal" });

  const handleSubmit = async (data: FormDataType) => {
    try {
      setLoading(true);
      const response = await axiosPrivate.patch(`/food/images/${id}`, {
        images: data.images,
      });
      if (response.status === 200) {
        toast.success("Images updated successfully!");
      } else {
        toast.error("Failed to update images. Please try again.");
      }
    } catch (error) {
      console.error("Error updating images:", error);
      toast.error("Failed to update images. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold mb-4">
            Update Image for Food: {state?.dishName}
          </h2>
          <Button size={"icon"} type="button" onClick={() => append("")}>
            <PlusSquareIcon />
          </Button>
        </div>

        <FormProvider
          className="px-4 mx-auto mt-12"
          form={form}
          onSubmit={handleSubmit}
        >
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div className="flex items-center space-x-2" key={field.id}>
                <Button
                  type="button"
                  size={"icon"}
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  <Trash />
                </Button>
                <RenderFormField
                  type="input"
                  key={field.id}
                  name={`images.${index}`}
                  inputType="text"
                  title={`Image URL ${index + 1}`}
                  control={form.control}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="mt-4 " disabled={loading}>
              {loading && <Loader className="mx-2 animate-spin" />}
              {loading ? "Uploading..." : "Update Images"}
            </Button>
          </div>
        </FormProvider>
      </div>
    </section>
  );
}
