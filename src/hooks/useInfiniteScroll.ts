import { useInfiniteQuery } from "@tanstack/react-query";
import { Axios } from "axios";

const fetchPosts = async (
  endpoint: string,
  customAxios: Axios,
  pageParam = 0,
  params: URLSearchParams
) => {
  const response = await customAxios.get(
    `${endpoint}?${params}&page=${pageParam}`
  );
  return response.data;
};

const useInfiniteScroll = (
  axios: Axios,
  endpoint: string,
  params: URLSearchParams
) => {
  const unikey: { [key: string]: string } = {};
  if (params?.entries()) {
    for (const [key, value] of params.entries()) {
      unikey[key] = value;
    }
  }
  return useInfiniteQuery({
    queryKey: ["fetchData", endpoint, unikey],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      return fetchPosts(endpoint, axios, pageParam, params);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.isNext ? Number(lastPage.currentPage) + 1 : null;
    },
  });
};

export default useInfiniteScroll;
