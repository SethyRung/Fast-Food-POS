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
  // const { data, error } = await useFetch(config.public.apiURL + "auth/login", {
  //   method: "post",
  //   body: {
  //     email: event.data.email,
  //     password: event.data.password,
  //   },
  //   headers: useRequestHeaders(["cookie"]),
  //   credentials: "include",
  // });

  // if (error.value) {
  //   const toast = useToast();
  //   toast.add({
  //     title: error.value?.data.message,
  //     icon: "i-heroicons-x-circle-solid",
  //     color: "red",
  //     timeout: 5000,
  //   });
  // } else {
  //   const userStore = useUserStore();
  //   userStore.isAuthenticated = true;
  //   userStore.uid = (data as any).value.uid;
  //   userStore.roles = (data as any).value.roles;

  //   localStorage.setItem("token", (data as any).value.accessToken);
  //   navigateTo("/", {
  //     replace: true,
  //   });
  // }
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
      label="Product Name"
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
    <UFormGroup
      label="Selling Price"
      name="price"
      required
      class="mb-5"
      :ui="{
        label: {
          base: 'text-base',
        },
      }"
    >
      <UInput
        type="number"
        v-model="state.price"
        :ui="{
          size: {
            sm: 'h-10',
          },
          base: 'text-sm',
          rounded: 'rounded',
        }"
      />
    </UFormGroup>
    <UFormGroup
      label="Category"
      name="category"
      required
      class="mb-5"
      :ui="{
        label: {
          base: 'text-base',
        },
      }"
    >
      <USelectMenu
        v-model="state.category"
        :options="categories"
        option-attribute="name"
        :ui="{
          size: {
            sm: 'h-10',
          },
          base: 'text-sm',
          rounded: 'rounded',
        }"
      />
    </UFormGroup>
    <UFormGroup
      label="Photo"
      name="photo"
      required
      class="mb-5"
      :ui="{
        label: {
          base: 'text-base',
        },
      }"
    >
      <div
        class="p-1 h-20 flex items-center ring-1 ring-inset ring-gray-300 rounded shadow-sm"
      >
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="h-16 w-16 object-cover border-none rounded"
        />
        <Icon v-else name="i-heroicons-photo-16-solid" size="64px" />
        <label
          for="fileUpload"
          class="flex justify-center items-center bg-navy-500 text-white text-xs h-[30px] px-[18px] py-[10px] ml-auto mr-5 rounded"
          >Choose Photo</label
        >
        <UInput
          id="fileUpload"
          type="file"
          @change="handleFileChange"
          class="sr-only"
        />
      </div>
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
