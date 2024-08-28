import { defineStore } from 'pinia';

export const useCommentStore = defineStore('comment', {
  state: () => ({
    comments: [] as { name: string; text: string; date: string }[],
  }),
  actions: {
    addComment(comment: { name: string; text: string; date: string }) {
      this.comments.push(comment);
    },
    getComments() {
      return this.comments;
    }
  }
});