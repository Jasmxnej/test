<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import EventService from '@/services/Service';
import type { Country } from '@/type'; 

const route = useRoute();
const country = ref<Country | null>(null); 
const error = ref<string | null>(null);

onMounted(async () => {
  try {
    const id = route.params.id as string;
    country.value = await EventService.getCountry(id);
  } catch (err) {
    error.value = (err as Error).message;
  }
});
</script>

<template>
  <div>
    <h2>Country Details</h2>
    <div v-if="country">
      <p>Country Name: {{ country.name }}</p>
      <p>Description: {{ country.description }}</p>
    </div>
  </div>
</template>
