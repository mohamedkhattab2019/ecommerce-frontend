import { defineStore } from 'pinia';

export const useSnackbarStore = defineStore('snackbar', {
  state: () => ({
    snackbar: {
      message: '',
      duration: 3000,
      mode: 'success', // success, error, info, etc.
      buttonText: '',
    },
  }),
  actions: {
    showSnackbarMessage({ message, duration = 3000, mode = 'success', buttonText = '' }) {
      this.snackbar = { message, duration, mode, buttonText };
    },
    clearSnackbar() {
      this.snackbar = { message: '', duration: 0, mode: '', buttonText: '' };
    },
    undoAction() {
      this.clearSnackbar(); // Clear snackbar on undo
    },
  },
});
