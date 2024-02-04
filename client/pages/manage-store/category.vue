<script setup lang="ts">
definePageMeta({
  title: "Category",
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
    label: "Category Name",
    sortable: true,
  },
  {
    key: "action",
    label: "Actions",
  },
];

const selectedColumns = ref(columns);
const columnsTable = computed(() =>
  columns.filter((column) => selectedColumns.value.includes(column))
);

// Selected Rows
const selectedRows = ref([]);

function select(row: any) {
  const index = selectedRows.value.findIndex(
    (item) => (item as any).id === row.id
  );
  if (index === -1) {
    selectedRows.value.push(row as never);
  } else {
    selectedRows.value.splice(index, 1);
  }
}

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
const pageTotal = ref(200); // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed(() =>
  Math.min(page.value * pageCount.value, pageTotal.value)
);

// Data
const { data: todos, pending } = await useLazyAsyncData<
  {
    id: number;
    title: string;
    completed: string;
  }[]
>(
  "todos",
  () =>
    ($fetch as any)(
      `https://jsonplaceholder.typicode.com/todos${searchStatus.value}`,
      {
        query: {
          q: search.value,
          _page: page.value,
          _limit: pageCount.value,
          _sort: sort.value.column,
          _order: sort.value.direction,
        },
      }
    ),
  {
    default: () => [],
    watch: [page, search, searchStatus, pageCount, sort],
  }
);
const isModalOpen = ref(false);
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
          @click="isModalOpen = true"
        >
          Add Category
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
      :rows="todos"
      :columns="columnsTable"
      :loading="pending"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      :ui="{ td: { base: 'max-w-[0] truncate' } }"
      @select="select"
    >
      <template #completed-data="{ row }">
        <UBadge
          size="xs"
          :label="row.completed ? 'Completed' : 'In Progress'"
          :color="row.completed ? 'emerald' : 'orange'"
          variant="subtle"
        />
      </template>

      <template #actions-data="{ row }">
        <UButton
          v-if="!row.completed"
          icon="i-heroicons-check"
          size="2xs"
          color="emerald"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        />

        <UButton
          v-else
          icon="i-heroicons-arrow-path"
          size="2xs"
          color="orange"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        />
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
    v-model="isModalOpen"
    prevent-close
    :ui="{
      container: 'items-center max-w-[548px] mx-auto',
    }"
  >
    <UCard
      :ui="{
        ring: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'max-h-[80vh] ',
        },
        base: 'max-w-[548px]',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Add Category
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="isModalOpen = false"
          />
        </div>
      </template>

      <FormModify-Category></FormModify-Category>
    </UCard>
  </UModal>
</template>
