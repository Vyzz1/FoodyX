import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FormRating } from "@/components/shared/form-rating";
import { ImageUploadDialog } from "@/components/shared/image-upload-dialog";
import { useState } from "react";
import { uploadFilesInOrder } from "@/lib/images-upload";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import useSubmitData from "@/hooks/useSubmitData";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";

const formSchema = z.object({
  content: z
    .string()
    .min(15, {
      message: "Content must be at least 15 characters long",
    })
    .max(500, {
      message: "Content must be at most 500 characters long",
    }),
  rating: z
    .number()
    .min(1, {
      message: "Rating must be at least 1",
    })
    .max(5, {
      message: "Rating must be at most 5",
    }),
});

interface RatingFormProps {
  orderId: string;
  menuItemId: string;
  onSuccess: () => void;
}

export default function RatingForm({
  onSuccess,
  orderId,
  menuItemId,
}: RatingFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();
  const [images, setImages] = useState<File[]>([]);

  const axios = useAxiosPrivate({ type: "normal" });

  const [loading, setLoading] = useState(false);
  const { mutate } = useSubmitData(
    "/review",
    () => {
      toast.success("Review submitted successfully!");
      form.reset();
      setImages([]);
      queryClient.invalidateQueries({
        queryKey: ["fetchData", "/order/me"],
      });

      queryClient.invalidateQueries({
        queryKey: ["fetchData", `/food/${menuItemId}`],
      });

      onSuccess();
    },
    () => {
      toast.error("Failed to submit the form. Please try again.");
    }
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      const uploadedImages: string[] = [];
      if (images.length > 0) {
        const newImages = await uploadFilesInOrder(images, axios);

        if (newImages) {
          uploadedImages.push(...newImages);
        } else {
          toast.error("Failed to upload images. Please try again.");
          return;
        }
      }

      const body = {
        ...values,
        images: uploadedImages,
        orderItemId: orderId,
        menuItemId: menuItemId,
      };

      mutate({ data: body, type: "post" });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  const labelClassName =
    "text-lg text-amber-500 font-semibold dark:text-amber-300 ";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full px-12  mx-auto py-10"
      >
        <div className="flex items-center justify-between">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClassName}> Rating</FormLabel>
                <FormControl>
                  <FormRating
                    size="lg"
                    value={field.value}
                    onChange={field.onChange}
                    color="text-yellow-500"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <ImageUploadDialog
            onSave={(_, blog) => {
              setImages(Array.from(blog.values()));
            }}
            existingImages={[]}
          />
        </div>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={labelClassName}>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="content"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>Tell us about this food</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-end space-x-4">
          <Button
            disabled={loading}
            type="submit"
            className="bg-amber-500 hover:bg-amber-600 shadow-md text-white"
          >
            {loading && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            Rate Now
          </Button>
        </div>
      </form>
    </Form>
  );
}
