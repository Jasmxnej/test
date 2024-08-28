<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useMessageStore } from '@/stores/message';
import { useRoute, useRouter } from 'vue-router';
import { useEventStore } from '@/stores/event';
import { useCommentStore } from '@/stores/comment';
import CountryContent from '@/components/CountryContent.vue';

const route = useRoute();
const router = useRouter();
const eventStore = useEventStore();
const commentStore = useCommentStore();
const messageStore = useMessageStore();

const commenterName = ref('');
const commentText = ref('');
const comments = ref<{ name: string; text: string; date: string }[]>([]);

const pageSize = ref(Number(route.query.pageSize) || 5);
const page = ref(Number(route.query.page) || 1);

const totalEvents = ref(0);

const totalPages = computed(() => Math.ceil(totalEvents.value / pageSize.value));
const hasNextPage = computed(() => page.value < totalPages.value);
const hasPrevPage = computed(() => page.value > 1);

onMounted(async () => {
  try {
    if (!route.query.pageSize || !route.query.page) {
      router.replace({
        name: 'list-view',
        query: { pageSize: pageSize.value, page: page.value },
      });
    }
    await eventStore.fetchAllEvents();
    totalEvents.value = eventStore.events.length;
    paginateData();
  } catch (error) {
    console.error('There was an error fetching events!', error);
  }
});

watch([pageSize, page], () => {
  paginateData();
});

function paginateData() {
  const start = (page.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  eventStore.paginatedEvents = eventStore.events.slice(start, end);
}

function updatePageSize(size: number) {
  pageSize.value = size;
  page.value = 1;
  router.push({
    name: 'list-view',
    query: {
      pageSize: pageSize.value,
      page: page.value,
    },
  });
}

function changePage(newPage: number) {
  page.value = newPage;
  router.push({
    name: 'list-view',
    query: {
      pageSize: pageSize.value,
      page: page.value,
    },
  });
}

function submitComment() {
  if (commentText.value.trim() === '' || commenterName.value.trim() === '') {
    alert('Please enter both your name and a comment.');
    return;
  }

  const newComment = {
    name: commenterName.value,
    text: commentText.value,
    date: new Date().toLocaleString(),
  };

  comments.value.push(newComment);

  messageStore.updateMessage('Comment successfully posted!');

  commenterName.value = '';
  commentText.value = '';
}
</script>

<template>
  <h1 class="text-3xl font-bold text-center mb-6">Olympic Medal Table</h1>

  <CountryContent />

  <div class="comment-box max-w-xl mx-auto p-6 border border-gray-300 rounded-lg mb-6">
    <h3 class="text-lg font-semibold mb-4">Leave a Comment</h3>
    <input
      v-model="commenterName"
      placeholder="Your name"
      class="w-full p-2 mb-4 border border-gray-300 rounded"
    />
    <textarea
      v-model="commentText"
      placeholder="Your comment"
      class="w-full p-2 mb-4 border border-gray-300 rounded"
    ></textarea>
    <button
      @click="submitComment"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Submit Comment
    </button>

    <ul class="mt-6 space-y-4">
      <li v-for="(comment, index) in comments" :key="index" class="bg-gray-100 p-4 rounded-lg">
        <strong>{{ comment.name }}</strong> ({{ comment.date }}): {{ comment.text }}
      </li>
    </ul>
    <ul class="mt-6 space-y-4">
      <li v-for="(comment, index) in commentStore.getComments()" :key="index" class="bg-gray-100 p-4 rounded-lg">
        <strong>{{ comment.name }}</strong> ({{ comment.date }}): {{ comment.text }}
      </li>
    </ul>
  </div>

  <div v-if="totalPages > 1" class="flex justify-between items-center max-w-sm mx-auto mb-6">
    <RouterLink
      v-if="hasPrevPage"
      :to="{ name: 'list-view', query: { page: page - 1, pageSize: pageSize } }"
      @click.prevent="changePage(page - 1)"
      class="text-600 hover:underline"
    >
      &#60; Previous
    </RouterLink>
    <span class="font-semibold">Page {{ page }} of {{ totalPages }}</span>
    <RouterLink
      v-if="hasNextPage"
      :to="{ name: 'list-view', query: { page: page + 1, pageSize: pageSize } }"
      @click.prevent="changePage(page + 1)"
      class="text-600 hover:underline"
    >
      Next &#62;
    </RouterLink>
  </div>

  <div v-if="totalEvents === 0" class="text-center text-gray-500">
    <p>No countries available.</p>
  </div>
</template>
