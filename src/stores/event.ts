import { defineStore } from 'pinia';
import { ref } from 'vue';
import { type Event } from '@/type';
import EventService from '@/services/Service'; 

export const useEventStore = defineStore('event', () => {
  const events = ref<Event[]>([]);
  const currentEvent = ref<Event | null>(null);
  const paginatedEvents = ref<Event[]>([]);

  function setEvents(newEvents: Event[]) {
    events.value = newEvents;
  }

  function setEvent(event: Event) {
    currentEvent.value = event;
  }

  function getEventById(id: string): Event | undefined {
    return events.value.find((event) => event.id === id);
  }

  async function fetchAllEvents() {
    try {
      const response = await EventService.getAllEvents(); 
      if (Array.isArray(response)) {
        events.value = response;
      } else {
        console.error('Expected an array but got:', response);
        events.value = []; 
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
      events.value = []; 
    }
  }

  return {
    events,
    currentEvent,
    paginatedEvents,
    setEvents,
    setEvent,
    getEventById,
    fetchAllEvents, 
  };
});
