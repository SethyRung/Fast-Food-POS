<script setup lang="ts">
definePageMeta({
  title: "Cashier",
  requiresAuth: true,
  roles: [5150],
});
</script>

<template>
  <div
    class="w-screen h-full font-rubik relative py-10 overflow-hidden flex items-center justify-center flex-col"
  >
    <h1 class="text-2xl font-bold text-navy-500 text-center">Cashier</h1>
    <Icon
      name="i-material-symbols-restore-page-outline-rounded"
      size="100"
      color="gray"
    />
  </div>
</template>
