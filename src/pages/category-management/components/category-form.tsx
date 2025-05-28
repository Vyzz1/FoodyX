import type React from "react";

import { useState } from "react";
import { ImagePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useSubmitData from "@/hooks/useSubmitData";
import { toast } from "sonner";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useQueryClient } from "@tanstack/react-query";

interface CategoryFormProps {
  category?: Category;
  isEditing: boolean;
  setOpen?: (open: boolean) => void;
}

export function CategoryForm({
  category,
  isEditing,
  setOpen,
}: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(category?.name || "");
  const [previewUrl, setPreviewUrl] = useState(category?.imageUrl || "");
  const [file, setFile] = useState<File | null>(null);

  const queryClient = useQueryClient();

  function onSuccess() {
    queryClient.invalidateQueries({
      queryKey: ["fetchData", "/category"],
    });

    toast.success(
      isEditing
        ? "Category updated successfully"
        : "Category created successfully"
    );
    setOpen?.(false);
  }

  const { mutate, isPending } = useSubmitData(
    isEditing ? `/category/${category?.id}` : "/category",
    onSuccess,
    (error: any) => {
      toast.error(error.response.data.message ?? "An error occurred");
    }
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const axios = useAxiosPrivate({ type: "upload" });



  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsLoading(true);

    try {
      if (!isEditing && !file) {
        toast.error("Category image is required");
        setIsLoading(false);
        return;
      }

      let data = {
        name,
        imageUrl: category?.imageUrl,
      };

      if (file) {
        const formData = new FormData();

        formData.append("file", file!);

        const imageResponse = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const { publicUrl } = await imageResponse.data;

        data = {
          ...data,
          imageUrl: publicUrl,
        };
      }

      mutate({ data, type: isEditing ? "put" : "post" });
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message ?? "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Edit Category" : "New Category"}</CardTitle>
          <CardDescription>
            {isEditing
              ? "Update your category information below."
              : "Fill in the details to create a new category."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Category Image</Label>
            <div className="flex flex-col gap-4">
              {previewUrl && (
                <img
                  src={previewUrl || "/placeholder.svg"}
                  alt="Category preview"
                  className="object-cover h-40 w-40 rounded-2xl"
                />
              )}
              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  disabled={isLoading}
                >
                  <ImagePlus className="mr-2 h-4 w-4" />
                  {previewUrl ? "Change Image" : "Upload Image"}
                </Button>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isPending}>
            {isLoading && isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isEditing && isPending ? "Saving..." : "Save "}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
