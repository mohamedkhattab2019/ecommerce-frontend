import { defineStore } from 'pinia';
import axiosInstance from '../plugins/axios';
import { useSnackbarStore } from './snackbar'; 
import { TAX_PERCENTAGE } from "../config";

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: [],
    total: 0,
    guestToken: localStorage.getItem('guestToken') || null, 
    selectedProducts: [],
    lastRemovedItem: null,
  }),
  getters: {
    selectedTotal(state) {
      return state.selectedProducts.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0
      );
    },
    calculateSelectedTotal(state) {
      const subtotal = state.selectedProducts.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0
      );
      const tax = subtotal * (TAX_PERCENTAGE / 100);
      const total = subtotal + tax;
      return { subtotal, tax, total };
    },
  },
  actions: {
    async initializeGuestToken() {
      if (!this.guestToken) {
        this.guestToken = crypto.randomUUID(); // Generate a unique guest token
        localStorage.setItem('guestToken', this.guestToken);
      }
    },
    async fetchCart() {
      await this.initializeGuestToken();
      try {
        const response = await axiosInstance.get('/api/cart', {
          headers: {
            'Guest-Token': this.guestToken,
          },
        });
        this.cart = response.data;
        this.calculateTotal();
      } catch (error) {
        console.error('Failed to fetch cart:', error);
      }
    },
    async addToCart(productId, quantity = 1) {
      await this.initializeGuestToken();
      try {
        const response = await axiosInstance.post(
          '/api/cart/add',
          { product_id: productId, quantity },
          {
            headers: {
              'Guest-Token': this.guestToken,
            },
          }
        );
        this.cart = response.data;
        this.calculateTotal();

        // Show success message
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Product added to cart!',
          duration: 3000,
          mode: 'success',
        });
      } catch (error) {
        console.error('Failed to add to cart:', error);

        // Show error message
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Failed to add product to cart.',
          duration: 3000,
          mode: 'fail',
        });
      }
    },
    async updateQuantity(productId, quantity) {
      try {
        const response = await axiosInstance.post(
          '/api/cart/update-quantity',
          { product_id: productId, quantity },
          {
            headers: {
              'Guest-Token': this.guestToken,
            },
          }
        );
        this.cart = response.data;
        this.calculateTotal();

        // Show success message
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Product quantity updated.',
          duration: 3000,
          mode: 'success',
        });
      } catch (error) {
        this.fetchCart();
        const snackbarStore = useSnackbarStore(); // Access the snackbar store
        snackbarStore.showSnackbarMessage({
          message: 'The requested quantity exceeds available stock.',
          duration: 3000,
          mode: 'fail',
        });
        // console.error('Failed to update cart quantity:', error);
      }
    },
    async removeFromCart(productId) {
      try {
        const itemToRemove = this.cart.data.find(item => item.productId === productId);
        this.lastRemovedItem = itemToRemove; // Save the item for undo

        const response = await axiosInstance.delete(`/api/cart/${productId}`, {
          headers: {
            'Guest-Token': this.guestToken,
          },
        });
        this.cart = response.data;
        this.calculateTotal();

        // Show success message
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Product removed from cart.',
          duration: 3000,
          mode: 'success',
        //   buttonText: 'Undo', // Add Undo option to the Snackbar
        });
      } catch (error) {
        // console.error('Failed to remove from cart:', error);
        this.fetchCart();
        // Show error message
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Failed to remove product from cart.',
          duration: 3000,
          mode: 'fail',
        });
      }
    },
    async clearCart() {
      try {
        const response = await axiosInstance.delete('/api/cart', {
          headers: {
            'Guest-Token': this.guestToken,
          },
        });
        this.cart = [];
        this.total = 0;

        // Show success message
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Cart cleared successfully.',
          duration: 3000,
          mode: 'success',
        //   buttonText: 'Undo', // Add Undo option to the Snackbar
        });
      } catch (error) {
        console.error('Failed to clear cart:', error);
        this.fetchCart();

        // Show error message
        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: 'Failed to clear the cart.',
          duration: 3000,
          mode: 'fail',
        });
      }
    },
    undoLastAction() {
      if (this.lastRemovedItem) {
        this.addToCart(this.lastRemovedItem.productId, this.lastRemovedItem.quantity);
        this.lastRemovedItem = null; // Reset last removed item after undo
      }
    },
    calculateTotal() {
      const cartArray = (this.cart && this.cart.data) ?? this.cart.data ;
      this.total = cartArray.reduce(
        (sum, item) => sum + item.productPrice * item.quantity,
        0
      );
    },
    addToSelected(item) {
      if (!this.selectedProducts.some((i) => i.productId === item.productId)) {
        this.selectedProducts.push(item);
      }
    },
    removeFromSelected(productId) {
      this.selectedProducts = this.selectedProducts.filter((item) => item.productId !== productId);
    },
  },
});
