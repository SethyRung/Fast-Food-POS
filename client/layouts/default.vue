<script setup lang="ts">
const isOpen = ref(false);
const height = ref(window.innerHeight + "px");
window.addEventListener("resize", (e) => {
  height.value = window.innerHeight + "px";
});
const router = useRouter();
router.beforeEach(() => {
  isOpen.value = false;
});
</script>

<template>
  <div :style="{ minHeight: height }" class="max-w-screen relative">
    <div
      class="w-full h-14 sticky top-0 z-40 flex justify-center items-center relatives bg-white border-none drop-shadow-md"
    >
      <UButton
        icon="i-heroicons-bars-3-bottom-left-16-solid"
        @click="isOpen = true"
        class="absolute left-6"
      />
      <h1 class="text-xl text-skylineBlue-500 font-bold font-rubik">
        {{ router.currentRoute.value.meta.title }}
      </h1>
    </div>

    <USlideover v-model="isOpen" :ui="{ width: 'max-w-64' }" side="left">
      <UCard
        class="flex flex-col flex-1"
        :ui="{
          body: { base: 'flex-1' },
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <NuxtLink
              to="/"
              class="text-base font-semibold leading-6 text-navy-500 dark:text-white"
            >
              MyNameStore
            </NuxtLink>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
            />
          </div>
        </template>
        <div class="h-full">
          <NuxtLink
            to="/cashier"
            class="h-14 flex items-center gap-5 text-navy-500 text-base font-rubik"
          >
            <img src="~assets/icons/sidebar/cashier.svg" />
            Cashier
          </NuxtLink>
          <NuxtLink
            to="/manage-store"
            class="h-14 flex items-center gap-5 text-navy-500 text-base font-rubik"
          >
            <img src="~assets/icons/sidebar/shop.svg" />
            Manage Store
          </NuxtLink>
          <NuxtLink
            to=""
            class="h-14 flex items-center gap-5 text-navy-500 text-base font-rubik"
          >
            <img src="~assets/icons/sidebar/user.svg" />
            Account
          </NuxtLink>
          <NuxtLink
            to=""
            class="h-14 flex items-center gap-5 text-navy-500 text-base font-rubik"
          >
            <img src="~assets/icons/sidebar/support.svg" />
            Support
          </NuxtLink>
        </div>
        <template #footer>
          <UButton label="Log out" color="white" block size="xl" />
        </template>
      </UCard>
    </USlideover>
    <slot />
  </div>
</template>
