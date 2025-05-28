import { Axios } from "axios";

export function updateImagesWithServerUrls(
  images: string[],
  localToServerMap: Map<string, string>
): string[] {
  return images.map((imageUrl) => {
    return localToServerMap.get(imageUrl) || imageUrl;
  });
}

/**
 * Uploads multiple files while preserving their order
 * @param files Array of files to upload
 * @param endpoint The server endpoint to upload to
 * @returns Promise resolving to an array of URLs in the same order as the input files
 */
export async function uploadFilesInOrder(
  files: File[],
  axiosPrivate: Axios,
  endpoint = "/upload/multiple"
): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const uploadResponse = await axiosPrivate.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  const responses = uploadResponse.data;

  return responses.map((response: { publicUrl: string }) => response.publicUrl);
}
