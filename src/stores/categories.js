import { defineStore } from 'pinia';
import axiosInstance from '../plugins/axios';

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [],
  }),
  actions: {
    async fetchCategories() {
      try {
        const response = await axiosInstance.get('/api/categories');;
        this.categories = response.data.data;
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },
    async createCategory(data) {
      try {
        const response = await axiosInstance.post('/api/categories',data);
        this.fetchCategories();
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    },
  },
});
