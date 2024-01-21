// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiURL: "http://localhost:8080/",
    },
  },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
  ],
  imports: {
    dirs: ["~/stores"],
  },
  colorMode: {
    preference: "light",
  },
  css: ["~/assets/css/main.css"],
});
