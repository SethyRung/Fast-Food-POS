<script setup lang="ts">
definePageMeta({
  layout: false,
});
const height = ref(window.innerHeight + "px");
window.addEventListener("resize", (e) => {
  height.value = window.innerHeight + "px";
});
navigateTo("/auth/login");
</script>

<template>
  <div
    class="w-screen font-rubik relative py-14 overflow-hidden"
    :style="{ minHeight: height }"
  >
    <div class="mb-24">
      <h1 class="text-2xl font-bold text-skylineBlue-500 text-center">
        Fast Foot POS
      </h1>
    </div>
    <div class="w-full grid place-items-center gap-10 mb-20">
      <img src="~/assets/images/auth.svg" />
      <h2 class="text-base font-bold text-navy-500">
        Easy Management for your Store.
      </h2>
    </div>
    <div class="px-6 w-full absolute bottom-14">
      <NuxtLink
        to="/auth/login"
        class="mobileLandscape:max-w-[324px] mobileLandscape:mx-auto grid place-items-center w-full h-14 bg-skylineBlue-500 text-base text-white rounded-2xl"
      >
        Log in
      </NuxtLink>
    </div>
  </div>
</template>
