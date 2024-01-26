<template>
  <div>
    <h1>Welcome Back</h1>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore();
if (!userStore.isAuthenticated) {
  await navigateTo("/auth", {
    replace: true,
  });
}
</script>
