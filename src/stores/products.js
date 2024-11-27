import { defineStore } from 'pinia';
import axiosInstance from '../plugins/axios';
import { useSnackbarStore } from './snackbar'; 

export const useProductsStore = defineStore('products', {
  state: () => ({
    products: [],
  }),
  actions: {
    async fetchProducts(categoryId) {
      try {
        const response = await axiosInstance.get(`/api/categories/${categoryId}/products`);
        this.products = response.data.data;
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    async fetchProductByID(productId) {
      try {
        const response = await axiosInstance.get(`/api/products/${productId}`);
        return response.data.data;
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    },
    async deleteProduct(productId,categoryId) {
      try {
        const response = await axiosInstance.delete(`/api/products/${productId}`);

        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Product Deleted Successfully!',
          duration: 3000,
          mode: 'success',
        });
        this.fetchProducts(categoryId);
      } catch (error) {
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Failed to delete product.',
          duration: 3000,
          mode: 'fail',
        });
      }
    },
  },
});
