<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const schema = z
  .object({
    name: z.string(),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .refine(
        (value) => /^(?=.*[A-Z]).+$/.test(value),
        "Password must contain at least one uppercase letter"
      )
      .refine(
        (value) => /^(?=.*[a-z]).+$/.test(value),
        "Password must contain at least one lowercase letter"
      )
      .refine(
        (value) => /.*\d.*/.test(value),
        "Password must contain at least one digit"
      )
      .refine(
        (value) => /[\W_]/.test(value),
        "Password must contain at least one symbol"
      ),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters long"),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Password do not macth",
    path: ["confirmPassword"],
  });

const state = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const config = useRuntimeConfig();

async function handleRegister(event: FormSubmitEvent<z.output<typeof schema>>) {
  const { data } = await useFetch(config.public.apiURL + "auth/register", {
    method: "post",
    body: {
      name: event.data.name,
      email: event.data.email,
      password: event.data.password,
    },
  });
  const toast = useToast();
  const res: any = data.value;
  toast.add({
    title: res.message,
    icon:
      res.status === "success"
        ? "i-heroicons-check-circle-solid"
        : "i-heroicons-x-circle-solid",
    color: res.status === "success" ? "primary" : "red",
    timeout: 60000,
  });
  if (res.status === "success") {
    state.name = undefined;
    state.email = undefined;
    state.password = undefined;
    state.confirmPassword = undefined;
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
          Create your account
        </h2>
      </template>

      <UForm :schema="schema" :state="state" @submit="handleRegister">
        <UFormGroup label="Name" name="name" required class="mb-5">
          <UInput
            icon="i-heroicons-envelope"
            placeholder="user123"
            v-model="state.name"
          />
        </UFormGroup>
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
            placeholder="p@ssW0rd"
            type="password"
            v-model="state.password"
          />
        </UFormGroup>
        <UFormGroup
          label="Confirm Password"
          name="confirmPassword"
          required
          class="mb-8"
        >
          <UInput
            type="password"
            icon="i-heroicons-lock-closed"
            placeholder="p@ssW0rd"
            v-model="state.confirmPassword"
          />
        </UFormGroup>

        <UButton label="Register" type="submit" block size="xl" />
        <p class="text-center mt-4">
          Already have an account?
          <ULink
            to="/auth/login"
            active-class="text-primary"
            inactive-class="text-primary"
          >
            Log in
          </ULink>
        </p>
      </UForm>
    </UCard>
    <UNotifications />
  </div>
</template>
