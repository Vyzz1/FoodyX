import type React from "react";

import { useState, useRef } from "react";
import { X, GripVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ImageUploadDialogProps {
  existingImages: string[];
  onSave: (images: string[], blogToFileMap: Map<string, File>) => void;
  trigger?: React.ReactNode;
  newFiles?: File[];
}

export function ImageUploadDialog({
  existingImages = [],
  onSave,
  trigger,
}: ImageUploadDialogProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const [blobToFileMap, setBlobToFileMap] = useState<Map<string, File>>(
    new Map()
  );

  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      addNewFiles(filesArray);
    }
  };

  const addNewFiles = (files: File[]) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    const newBlobToFileMap = new Map<string, File>(blobToFileMap);

    const newImageUrls = validFiles.map((file) => {
      const blobUrl = URL.createObjectURL(file);
      newBlobToFileMap.set(blobUrl, file);
      return blobUrl;
    });

    setBlobToFileMap(newBlobToFileMap);

    setImages((prev) => [...prev, ...newImageUrls]);
    setNewFiles((prev) => [...prev, ...validFiles]);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      addNewFiles(filesArray);
    }
  };

  const removeImage = (index: number) => {
    const imageUrl = images[index];

    if (imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
      const newMap = new Map(blobToFileMap);
      newMap.delete(imageUrl);
      setBlobToFileMap(newMap);

      const file = blobToFileMap.get(imageUrl);
      if (file) {
        setNewFiles((prev) => prev.filter((f) => f !== file));
      }
    }

    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSave = () => {
    onSave(images, blobToFileMap);
    setOpen(false);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    const img = new Image();
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleImageDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleImageDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();

    if (draggedIndex !== null && draggedIndex !== index) {
      const newImages = [...images];
      const draggedImage = newImages[draggedIndex];

      // Remove the dragged item
      newImages.splice(draggedIndex, 1);
      // Insert it at the new position
      newImages.splice(index, 0, draggedImage);

      setImages(newImages);

      // If we're reordering new files, we need to update newFiles array too
      if (
        draggedIndex >= existingImages.length ||
        index >= existingImages.length
      ) {
        const newFilesCopy = [...newFiles];

        // Calculate indices in the newFiles array
        const newFileDraggedIndex =
          draggedIndex >= existingImages.length
            ? draggedIndex - existingImages.length
            : -1;

        const newFileDropIndex =
          index >= existingImages.length ? index - existingImages.length : -1;

        // Only reorder if both indices are valid
        if (newFileDraggedIndex >= 0 && newFileDropIndex >= 0) {
          const draggedFile = newFilesCopy[newFileDraggedIndex];
          newFilesCopy.splice(newFileDraggedIndex, 1);
          newFilesCopy.splice(newFileDropIndex, 0, draggedFile);
          setNewFiles(newFilesCopy);
        }
      }
    }

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button variant="outline">Upload Images</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Upload Images</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging ? "border-primary bg-primary/10" : "border-border"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Drag and drop your images here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports: JPG, PNG, GIF, etc.
              </p>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative group aspect-square border-2 rounded-md ${
                    draggedIndex === index
                      ? "opacity-50 border-primary"
                      : dragOverIndex === index
                      ? "border-primary border-dashed"
                      : "border-transparent"
                  }`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleImageDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleImageDrop(e, index)}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Image ${index + 1}`}
                    className="object-cover rounded-md w-full h-full"
                  />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="absolute top-1 right-1 z-10">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-black/50 rounded-full p-1 text-white"
                        aria-label="Remove image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <div className="absolute top-1 left-1 z-10 cursor-grab active:cursor-grabbing">
                      <div className="bg-black/50 rounded-full p-1 text-white">
                        <GripVertical size={16} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter className="flex flex-row justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
