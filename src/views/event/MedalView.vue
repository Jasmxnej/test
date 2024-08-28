<script setup lang="ts">
import { defineProps } from 'vue'
import { type Event } from '@/type'

const props = defineProps<{ event: Event }>()
</script>

<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Medal Details for {{ event.name }}</h2>

    
    <h3 class="text-xl font-semibold mt-4 mb-2">Until 2024</h3>
    <div class="mb-4">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="p-2 border border-gray-300">Sport</th>
            <th class="p-2 border border-gray-300">Gold</th>
            <th class="p-2 border border-gray-300">Silver</th>
            <th class="p-2 border border-gray-300">Bronze</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="sport in event.medals_by_sport?.until_2024?.sports || []" :key="sport.name">
            <td class="p-2 border border-gray-300">{{ sport.name }}</td>
            <td class="p-2 border border-gray-300">{{ sport.gold }}</td>
            <td class="p-2 border border-gray-300">{{ sport.silver }}</td>
            <td class="p-2 border border-gray-300">{{ sport.bronze }}</td>
          </tr>
          
          <tr class="font-semibold bg-gray-100">
            <td class="p-2 border border-gray-300">Total</td>
            <td class="p-2 border border-gray-300">
              {{ event.medals_by_sport?.until_2024?.total?.gold || 0 }}
            </td>
            <td class="p-2 border border-gray-300">
              {{ event.medals_by_sport?.until_2024?.total?.silver || 0 }}
            </td>
            <td class="p-2 border border-gray-300">
              {{ event.medals_by_sport?.until_2024?.total?.bronze || 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
