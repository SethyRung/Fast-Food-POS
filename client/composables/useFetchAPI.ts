import { useFetch } from "nuxt/app";

export async function useFetchAPI<T>(url: string, options: any = {}) {
  options.baseURL = useRuntimeConfig().public.apiURL;
  options.headers = {
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
  options.credentials = "include";
  let result = await useFetch<T>(url, options);
  if (result.error.value) {
    const status = result.error.value.statusCode;
    const message = result.error.value.data.message;
    if (status == 403 && message === "expired access token") {
      const { data, error } = await useFetch("/refresh", options);
      if (error.value) {
        if (
          error.value.statusCode == 403 &&
          error.value.data.message === "expired refresh token"
        ) {
          //update user state
          const userStore = useUserStore();
          userStore.uid = 0;
          userStore.isAuthenticated = false;
          userStore.roles = [];
        }
      } else {
        const accessToken = (data as any).value.accessToken;
        localStorage.setItem("token", accessToken);
        options.headers = {
          Authorization: "Bearer " + accessToken,
        };
        result = await useFetch<T>(url, options);
      }
    }
  }
  return result;
}
