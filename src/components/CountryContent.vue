<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { useEventStore } from '@/stores/event';
import { type Event } from '@/type'; 

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();

const events = ref<Event[]>([]); 
const pageSize = ref(Number(route.query.pageSize) || 5);
const page = ref(Number(route.query.page) || 1);

const totalEvents = computed(() => eventStore.events.length || 0);
const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize.value));
const hasNextPage = computed(() => page.value < totalPages.value);
const hasPrevPage = computed(() => page.value > 1);

function paginateData() {
  if (eventStore.events.length > 0) {
    const start = (page.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    events.value = eventStore.events.slice(start, end);
  } else {
    events.value = []; 
  }
}

onMounted(async () => {
  if (eventStore.events.length === 0) {
    await eventStore.fetchAllEvents();
  }
  paginateData();
});

watch([pageSize, page, eventStore.events], () => {
  paginateData();
});

function updatePageSize(size: number) {
  pageSize.value = size;
  page.value = 1;
  router.push({
    name: 'list-view',
    query: {
      pageSize: pageSize.value,
      page: page.value
    }
  });
}

</script>

<template>
  <table class="min-w-full table-auto border-collapse mb-6">
    <thead>
      <tr class="bg-gray-100">
        <th class="px-4 py-2 border text-center">Flag</th>
        <th class="px-4 py-2 border text-center">
          Country
          <select
            id="page-size"
            v-model="pageSize"
            @change="updatePageSize(pageSize)"
            class="border rounded px-2 py-1"
          >
            <option v-for="n in [5, 10, 15, 20, 25, 30]" :key="n" :value="n">{{ n }}</option>
          </select>
        </th>
        <th class="px-4 py-2 border text-center">Gold</th>
        <th class="px-4 py-2 border text-center">Silver</th>
        <th class="px-4 py-2 border text-center">Bronze</th>
        <th class="px-4 py-2 border text-center">Total Medals</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="event in events" :key="event.id" class="hover:bg-gray-50">
        <td class="px-4 py-2 border text-center">
          <img :src="event.flag_url" alt="Flag" class="w-12 h-auto mx-auto" />
        </td>
        <td class="px-4 py-2 border">
          <RouterLink
            :to="{ name: 'layout-view', params: { id: event.id } }"
            class="text-600 hover:underline"
          >
            {{ event.name }}
          </RouterLink>
        </td>
        <td class="px-4 py-2 border text-center">
          {{ event.medals_by_sport?.until_2024?.total?.gold || 0 }}
        </td>
        <td class="px-4 py-2 border text-center">
          {{ event.medals_by_sport?.until_2024?.total?.silver || 0 }}
        </td>
        <td class="px-4 py-2 border text-center">
          {{ event.medals_by_sport?.until_2024?.total?.bronze || 0 }}
        </td>
        <td class="px-4 py-2 border text-center">{{ event.total_medals }}</td>
      </tr>
    </tbody>
  </table>
</template>
