export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();

  if (to.meta.requiresAuth) {
    if (userStore.isAuthenticated) {
      for (let i = 0; i < userStore.roles.length; i++) {
        if (
          !(to.meta.roles as any).includes(userStore.roles[i]) &&
          to.fullPath !== "/"
        )
          return navigateTo("/");
      }
    } else {
      const { data, error } = await useFetchAPI("auth/currentUser");
      userStore.isAuthenticated = true;
      userStore.uid = (data.value as any).uid;
      userStore.roles = (data.value as any).roles;

      if (!error.value) {
        for (let i = 0; i < userStore.roles.length; i++) {
          if (
            !(to.meta.roles as any).includes(userStore.roles[i]) &&
            to.fullPath !== "/"
          )
            return navigateTo("/");
        }
      } else if (to.fullPath !== "/") return navigateTo("/");
    }
  }
});
