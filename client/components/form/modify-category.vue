<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";

const schema = z.object({
  name: z.string(),
  price: z
    .number({ invalid_type_error: "Price must be a valid number" })
    .positive({ message: "Price must be greater than 0" }),
  category: z
    .custom<CategoryType>()
    .refine((category) => !!category, { message: "Required" }),
  photo: z
    .custom<File>()
    .refine((file) => !!file, { message: "Required" })
    .refine(
      (file) => !!file && file.size <= 5 * 1024 * 1024, // Max 5MB
      { message: "File size must be less than 5MB" }
    )
    .refine(
      (file) =>
        !!file && ["image/png", "image/jpeg", "image/jpg"].includes(file.type), // Allow only images
      { message: "Only png, jpg and jpeg are allowed" }
    ),
});

type CategoryType = {
  id: number;
  name: string;
};

type ProductType = {
  name: string | undefined;
  price: number | undefined;
  category: CategoryType | undefined;
  photo: File | undefined;
};

const state = reactive<ProductType>({
  name: undefined,
  price: undefined,
  category: undefined,
  photo: undefined,
});

const categories = [
  {
    id: 1,
    name: "Burgers",
  },
  {
    id: 2,
    name: "Pizza",
  },
  {
    id: 3,
    name: "Fried Chicken",
  },
  {
    id: 4,
    name: "Sandwiches",
  },
  {
    id: 5,
    name: "Hot Dogs",
  },
  {
    id: 6,
    name: "Tacos",
  },
  {
    id: 7,
    name: "Burritos",
  },
  {
    id: 8,
    name: "French Fries",
  },
];

const imageUrl = ref<string | null>(null);

const handleFileChange = (event: Event) => {
  imageUrl.value = null;
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  state.photo = file;

  if (["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        imageUrl.value = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

async function handleLogin(event: FormSubmitEvent<z.output<typeof schema>>) {
  console.log(event.data);
}
</script>

<template>
  <UForm
    :schema="schema"
    :state="state"
    class="font-rubik"
    @submit="handleLogin"
  >
    <UFormGroup
      label="Category Name"
      name="name"
      required
      class="mb-5"
      :ui="{
        label: {
          base: 'text-base',
        },
      }"
    >
      <UInput
        v-model="state.name"
        :ui="{
          size: {
            sm: 'h-10',
          },
          base: 'text-sm',
          rounded: 'rounded',
        }"
      />
    </UFormGroup>

    <UButton
      label="Submid"
      type="submit"
      block
      :ui="{
        base: 'text-base h-10',
        rounded: 'rounded',
      }"
    />
  </UForm>
</template>
