<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type { CategoryType, ProductType } from "~/lib/types";

const schema = z.object({
  name: z
    .string()
    .refine((val) => val.trim().length > 0, { message: "Required" }),
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

const state = reactive<{
  id: number | undefined;
  name: string | undefined;
  price: number | undefined;
  category: CategoryType | undefined;
  photo: File | undefined;
}>({
  id: undefined,
  name: undefined,
  price: undefined,
  category: undefined,
  photo: undefined,
});

const { data, error } = await useFetchAPI<{
  status: string;
  data: {
    categories: [
      {
        id: number;
        name: string;
      }
    ];
  };
}>("category");

const categories = ref<CategoryType[]>([]);
if (!error.value) categories.value = data.value?.data.categories!;

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

const emit = defineEmits(["modified", "close"]);

const props = defineProps<{
  action: string;
  id: number;
}>();

let photo: string;
if (props.action === "Edit") {
  const { data, error } = await useFetchAPI<{
    status: string;
    data: {
      product: {
        id: number;
        name: string;
        price: number;
        photo: string;
        Category: {
          id: number;
          name: string;
        };
      };
    };
  }>(`product/${props.id}`);

  if (!error.value) {
    state.id = data.value!.data.product.id;
    state.name = data.value!.data.product.name;
    state.price = parseFloat(data.value!.data.product.price.toString());
    state.category = {
      id: data.value!.data.product.Category.id,
      name: data.value!.data.product.Category.name,
    };

    //load image
    const url = `${useRuntimeConfig().public.apiURL}public/images/${
      data.value!.data.product.photo
    }`;
    photo = data.value!.data.product.photo;
    imageUrl.value = url;
    const { data: res } = await useFetch(url);
    state.photo = res.value as File;
  }
}

async function handleSubmit(event: FormSubmitEvent<ProductType>) {
  const formData = new FormData();
  const toast = useToast();
  try {
    if (
      props.action === "Add" ||
      (props.action === "Edit" && !!state.photo?.name)
    ) {
      formData.append(state.photo!.name, state.photo!);
      const { data: resUpload, error } = await useFetchAPI("upload", {
        method: "post",
        body: formData,
      });
      if (error.value) throw error.value?.data.data.message;
      photo = (resUpload.value as any).data.files[0];
    }
    const { data, error } =
      props.action === "Add"
        ? await useFetchAPI("product", {
            method: "post",
            body: {
              name: event.data.name!.trim(),
              price: event.data.price,
              photo: photo,
              categoryId: event.data.category?.id,
            },
          })
        : await useFetchAPI(`product/${event.data.id}`, {
            method: "put",
            body: {
              name: event.data.name!.trim(),
              price: event.data.price,
              photo: photo,
              categoryId: event.data.category?.id,
            },
          });

    if (error.value) throw error.value?.data.data.message;
    else {
      toast.add({
        title: (data.value as any).data.message,
        icon: "i-heroicons-check-circle-solid",
        color: "primary",
        timeout: 5000,
        callback: () => {
          emit("close");
        },
      });

      emit("modified", {
        id:
          props.action === "Add"
            ? (data.value as any).data.product.id
            : state.id,
        name: state.name,
        price: state.price,
        photo: photo,
        categoryId: state.category!.id,
        categoryName: state.category!.name,
      });
    }
  } catch (e: any) {
    toast.add({
      title: e,
      icon: "i-heroicons-x-circle-solid",
      color: "red",
      timeout: 5000,
    });
  }
}
</script>

<template>
  <UNotifications :ui="{ position: 'top-0 bottom-auto' }" />
  <UForm
    :schema="schema"
    :state="state"
    class="font-rubik"
    @submit="handleSubmit"
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
        step="any"
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
