import axios from "axios";

export const baseURL = `https://food-ordering-system-lemon.vercel.app/api`;

export default axios.create({
  baseURL: baseURL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
});

export const normalAxios = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const axiosUpload = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "multipart/form-data" },
  withCredentials: true,
});

export const gongsAPIURL = `https://rsapi.goong.io`;

export const getAutocompleteOptions = (input: string) => ({
  methodL: "GET",
  baseURL: gongsAPIURL,
  url: "/Place/AutoComplete",
  params: {
    api_key: import.meta.env.VITE_GOONG_API_KEY,
    input: input,
  },
});
