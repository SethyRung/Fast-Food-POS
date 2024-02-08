<script lang="ts" setup>
import { z } from "zod";
import type { FormSubmitEvent } from "@nuxt/ui/dist/runtime/types";
import type { CategoryType, ProductType } from "~/lib/types";

const schema = z.object({
  name: z.string(),
});

const state = reactive<CategoryType>({
  name: undefined,
});

const emit = defineEmits(["modified", "close"]);

const props = defineProps<{
  action: string;
  category: CategoryType;
}>();

if (props.action === "Add") {
  state.id = undefined;
  state.name = undefined;
} else {
  state.id = props.category.id;
  state.name = props.category.name;
}
async function handleSubmit(event: FormSubmitEvent<CategoryType>) {
  const { data, error } =
    props.action === "Add"
      ? await useFetchAPI("category", {
          method: "post",
          body: { name: event.data.name!.trim() },
        })
      : await useFetchAPI(`category/${event.data.id}`, {
          method: "put",
          body: { name: event.data.name!.trim() },
        });
  const toast = useToast();

  if (error.value) {
    toast.add({
      title: error.value?.data.data.message,
      icon: "i-heroicons-x-circle-solid",
      color: "red",
      timeout: 5000,
    });
  } else {
    toast.add({
      title: (data.value as any).data.message,
      icon: "i-heroicons-check-circle-solid",
      color: "primary",
      timeout: 5000,
      callback: () => {
        emit("close");
      },
    });
    props.action === "Add"
      ? emit("modified", (data.value as any).data.category)
      : emit("modified", state);
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
