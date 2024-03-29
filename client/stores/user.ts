import { defineStore } from "pinia";

export const useUserStore = defineStore({
  id: "user",
  state: () => {
    return {
      isAuthenticated: false,
      uid: 0,
      roles: [],
    };
  },
});
