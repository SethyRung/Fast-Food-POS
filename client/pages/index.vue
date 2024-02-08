<script lang="ts" setup>
definePageMeta({
  title: "Home",
  requiresAuth: true,
  roles: [2001],
});

if (useUserStore().isAuthenticated == false)
  navigateTo("/auth/login", { replace: true });
</script>

<template>
  <div class="w-screen font-rubik relative py-10 overflow-hidden">
    <h1 class="text-2xl font-bold text-navy-500 text-center">
      Welcome to Fast Foot POS
    </h1>
    <div class="w-full grid place-items-center gap-10 my-14">
      <img src="~/assets/images/home.svg" />
      <h2 class="text-base font-bold text-navy-500 text-center">
        The quickest way to buy & receive
      </h2>
    </div>
    <!-- <div class="px-6 w-full">
      <NuxtLink
        to="/auth/login"
        class="mobileLandscape:max-w-[324px] mobileLandscape:mx-auto flex items-center justify-center gap-10 w-full h-14 bg-skylineBlue-500 text-base text-white rounded-2xl"
      >
        Let’s get started
        <Icon name="heroicons:arrow-right-16-solid" class="white" />
      </NuxtLink>
    </div> -->
  </div>
</template>
