<script setup lang="ts">
import { ref, watch, onMounted, defineProps } from 'vue';
import { useEventStore } from '@/stores/event';
import { type Event } from '@/type';

const props = defineProps<{ page: number; pageSize: number }>();

const events = ref<Event[]>([]);
const eventStore = useEventStore();

function paginateData() {
  const start = (props.page - 1) * props.pageSize;
  const end = start + props.pageSize;
  events.value = eventStore.events.slice(start, end);
}

onMounted(() => {
  paginateData();
});

watch([() => props.page, () => props.pageSize, eventStore.events], () => {
  paginateData();
});
</script>

<template>
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
</template>
