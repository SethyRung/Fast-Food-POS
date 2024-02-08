<script setup lang="ts">
import type { CategoryType } from "~/lib/types";

definePageMeta({
  title: "Category",
  requiresAuth: true,
  roles: [5150],
});
// Columns
const columns = [
  {
    key: "id",
    label: "#",
    sortable: true,
  },
  {
    key: "name",
    label: "CategoryType Name",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const selectedColumns = ref(columns);
const columnsTable = computed(() =>
  columns.filter((column) => selectedColumns.value.includes(column))
);

// Selected Rows
const category = ref<CategoryType | undefined>(undefined);

const search = ref("");
const selectedStatus = ref<any>([]);
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return "";
  }

  if (selectedStatus?.value?.length > 1) {
    return `?completed=${selectedStatus.value[0].value}&completed=${selectedStatus.value[1].value}`;
  }

  return `?completed=${selectedStatus.value[0].value}`;
});

const resetFilters = () => {
  search.value = "";
  selectedStatus.value = [];
};

// Pagination
const sort = ref({ column: "id", direction: "asc" as const });
const page = ref(1);
const pageCount = ref(10);
const pageTotal = ref(0);
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

// Data
const { data, pending } = await useFetchAPI<{
  status: string;
  data: {
    categories: [
      {
        id: number;
        name: string;
      }
    ];
  };
}>("category", {
  watch: [page, search, searchStatus, pageCount, sort],
});

const categories = ref<CategoryType[]>([]);
if (data.value !== null) {
  categories.value = data.value.data.categories;
  pageTotal.value = categories.value.length;
}

const isModify = ref(false);
const actionType = ref<string>();

const items = (row: CategoryType) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        isModify.value = true;
        actionType.value = "Edit";
        category.value = row;
      },
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        isModify.value = true;
        actionType.value = "Delete";
        category.value = row;
      },
    },
  ],
];

const toast = useToast();
const handleDelete = async () => {
  const { data, error } = await useFetchAPI(`category/${category.value!.id}`, {
    method: "delete",
  });
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
    });
    categories.value = categories.value!.filter(
      (e) => e.id !== category.value?.id
    );

    isModify.value = false;
    // selectedRows.value.pop();
  }
};
</script>

<template>
  <UCard
    class="w-full"
    :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: {
        padding: 'px-4',
        base: 'divide-y divide-gray-200 dark:divide-gray-700',
      },
      footer: { padding: 'p-4' },
    }"
  >
    <!-- Filters -->
    <div class="flex items-center justify-start tablet:justify-end gap-3 py-3">
      <UInput
        v-model="search"
        icon="i-heroicons-magnifying-glass-20-solid"
        placeholder="Search..."
        :ui="{ base: 'tablet:w-[276px]' }"
      />
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between flex-wrap items-center w-full py-3 gap-4">
      <div class="flex items-center gap-1.5">
        <UButton
          icon="i-heroicons-plus-circle"
          color="gray"
          @click="
            () => {
              isModify = true;
              actionType = 'Add';
            }
          "
        >
          Add CategoryType
        </UButton>
      </div>

      <div class="flex flex-wrap gap-1.5 items-center">
        <div class="flex items-center gap-1.5">
          <span class="text-sm leading-5">Rows per page:</span>

          <USelectMenu
            v-model.number="pageCount"
            :options="['5', '10', '20']"
            class="w-[90px]"
          />
        </div>

        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          :disabled="search === '' && selectedStatus.length === 0"
          @click="resetFilters"
        >
          Reset
        </UButton>
      </div>
    </div>

    <!-- Table -->
    <UTable
      v-model:sort="sort"
      :rows="categories"
      :columns="columnsTable"
      :loading="pending"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      :ui="{ td: { base: 'max-w-[0] truncate' } }"
    >
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="pageTotal"
          :max="5"
          :ui="{
            wrapper: 'w-full flex items-center justify-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'outline',
              },
            },
          }"
        />
      </div>
    </template>
  </UCard>

  <UModal
    v-model="isModify"
    prevent-close
    :ui="{
      container: 'items-center max-w-[548px] mx-auto',
    }"
  >
    <UCard
      v-if="actionType !== 'Delete'"
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'max-h-[80vh] ',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ actionType }} CategoryType
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isModify = false"
          />
        </div>
      </template>

      <FormModify-Category
        :action="(actionType as string)"
        :category="(category as CategoryType)"
        @modified="
          (c: CategoryType) => {
            actionType==='Add' ? categories.push(c): category!.name = c.name;
          }
        "
        @close="isModify = false"
      ></FormModify-Category>
    </UCard>
    <UAlert
      v-else
      title="Are you sure you want to delete category?"
      :actions="[
        {
          label: 'Yes, Delete',
          variant: 'solid',
          color: 'primary',
          click: handleDelete,
        },
        {
          label: 'Cancel',
          variant: 'solid',
          color: 'red',
          click: () => {
            isModify = false;
          },
        },
      ]"
    />
  </UModal>
  <UNotifications :ui="{ position: 'top-0 bottom-auto' }" />
</template>
