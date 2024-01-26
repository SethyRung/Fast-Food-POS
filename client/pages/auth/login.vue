<script setup lang="ts">
import { string, z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

const state = reactive({
  email: undefined,
  password: undefined,
});

const config = useRuntimeConfig();

async function handleLogin(event: FormSubmitEvent<z.output<typeof schema>>) {
  const { data, error } = await useFetch(config.public.apiURL + "auth/login", {
    method: "post",
    body: {
      email: event.data.email,
      password: event.data.password,
    },
    headers: useRequestHeaders(["cookie"]),
    credentials: "include",
  });

  if (error.value) {
    const toast = useToast();
    toast.add({
      title: error.value?.data.message,
      icon: "i-heroicons-x-circle-solid",
      color: "red",
      timeout: 5000,
    });
  } else {
    state.email = undefined;
    state.password = undefined;
    const userStore = useUserStore();
    userStore.isAuthenticated = true;
    userStore.uid = (data as any).value.uid;
    userStore.roles = (data as any).value.roles;

    localStorage.setItem("token", (data as any).value.accessToken);
    await navigateTo("/", {
      replace: true,
    });
  }
}
const height = ref(window.innerHeight + "px");
window.addEventListener("resize", (e) => {
  height.value = window.innerHeight + "px";
});
</script>

<template>
  <div
    class="w-full flex justify-center items-center"
    :style="{ minHeight: height }"
  >
    <UCard
      class="w-full h-fit sm:w-96 px-2"
      :ui="{ ring: 'ring-0', shadow: 'shadow-none', divide: 'divide-y-0' }"
    >
      <template #header>
        <h2
          class="text-center text-2xl text-skylineBlue-500 font-rubik font-bold"
        >
          Log in
        </h2>
      </template>

      <UForm
        :schema="schema"
        :state="state"
        @submit="handleLogin"
        class="font-rubik"
      >
        <UFormGroup
          label="Email"
          name="email"
          required
          class="mb-5"
          :ui="{
            label: {
              base: 'text-base',
            },
          }"
        >
          <UInput
            icon="i-heroicons-envelope"
            placeholder="example@email.com"
            v-model="state.email"
            :ui="{
              size: {
                sm: 'h-14',
              },
              base: 'text-sm',
              rounded: 'rounded-2xl',
            }"
          />
        </UFormGroup>
        <UFormGroup
          label="Password"
          name="password"
          required
          class="mb-8"
          :ui="{
            label: {
              base: 'text-base',
            },
          }"
        >
          <UInput
            icon="i-heroicons-lock-closed"
            placeholder="p@ssW0rd"
            type="password"
            v-model="state.password"
            :ui="{
              size: {
                sm: 'h-14',
              },
              base: 'text-sm',
              rounded: 'rounded-2xl',
            }"
          />
        </UFormGroup>

        <UButton
          label="Log In"
          type="submit"
          block
          :ui="{
            size: {
              sm: 'h-14',
            },
            base: 'text-base',
            rounded: 'rounded-2xl',
          }"
        />
      </UForm>
    </UCard>
    <UNotifications />
  </div>
</template>
