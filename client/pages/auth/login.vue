<script setup lang="ts">
import { number, string, z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string(),
});

const state = reactive({
  email: "rungsethyhk@gmail.com",
  password: "Rs123451@",
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
    // state.email = "";
    // state.password = "";
    //do something
    // this.userLoggedIn = true;
    // this.uid = res.data.uid;
    // this.roles = res.data.roles;
    // localStorage.setItem("token", res.data.accessToken);
    // axios.defaults.headers.common[
    //   "Authorization"
    // ] = `Bearer ${res.data.accessToken}`;
    // this.$router.push({ name: "home", replace: true });
  }
}
</script>

<template>
  <div
    class="w-full flex justify-center items-center"
    style="min-height: calc(100vh - 100px)"
  >
    <UCard class="w-80 h-fit sm:w-96">
      <template #header>
        <h2 class="text-center text-3xl text-green-500 font-bold">
          Welcome back
        </h2>
      </template>

      <UForm :schema="schema" :state="state" @submit="handleLogin">
        <UFormGroup label="Email" name="email" required class="mb-5">
          <UInput
            icon="i-heroicons-envelope"
            placeholder="example@email.com"
            v-model="state.email"
          />
        </UFormGroup>
        <UFormGroup label="Password" name="password" required class="mb-8">
          <UInput
            icon="i-heroicons-lock-closed"
            placeholder="p@ssw0rd"
            type="password"
            v-model="state.password"
          />
        </UFormGroup>

        <UButton label="Log In" type="submit" block size="xl" />
        <p class="text-center mt-4">
          Don't have a account?
          <ULink
            to="/auth/register"
            active-class="text-primary"
            inactive-class="text-primary"
          >
            Register
          </ULink>
        </p>
      </UForm>
    </UCard>
    <UNotifications />
  </div>
</template>
