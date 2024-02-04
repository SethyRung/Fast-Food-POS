<script setup lang="ts">
definePageMeta({
  title: "Manage Store",
  // requiresAuth: true,
  // roles: [2001],
});
</script>

<template>
  <div class="w-screen font-rubik text-navy-500 relative p-6 overflow-hidden">
    <div class="mb-10">
      <h2 class="text-base font-bold">Set Product</h2>
      <NuxtLink
        to="/manage-store/product"
        class="w-full h-14 flex justify-between items-center border-b border-navy-100"
      >
        Product
        <Icon
          name="heroicons:chevron-right-16-solid"
          color="black"
          size="24px"
        />
      </NuxtLink>
      <NuxtLink
        to="/manage-store/category"
        class="w-full h-14 flex justify-between items-center border-b border-navy-100"
      >
        Category Product
        <Icon
          name="heroicons:chevron-right-16-solid"
          color="black"
          size="24px"
        />
      </NuxtLink>
    </div>
    <div class="mb-10">
      <h2 class="text-base font-bold">Set Branch & Employee</h2>
      <NuxtLink
        to=""
        class="w-full h-14 flex justify-between items-center border-b border-navy-100"
      >
        Employee List
        <Icon
          name="heroicons:chevron-right-16-solid"
          color="black"
          size="24px"
        />
      </NuxtLink>
      <NuxtLink
        to=""
        class="w-full h-14 flex justify-between items-center border-b border-navy-100"
      >
        Customer List
        <Icon
          name="heroicons:chevron-right-16-solid"
          color="black"
          size="24px"
        />
      </NuxtLink>
    </div>
  </div>
</template>
