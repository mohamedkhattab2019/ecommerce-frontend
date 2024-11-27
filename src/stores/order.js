import { defineStore } from 'pinia';
import axiosInstance from '../plugins/axios';
import { useSnackbarStore } from './snackbar';

export const useOrderStore = defineStore('order', {
  state: () => ({
    order: null,
    userOrders: null,
    isLoading: false,
    error: null,
    guestToken: localStorage.getItem('guestToken') || null, // Store guest token

  }),
  actions: {
    async initializeGuestToken() {
      if (!this.guestToken) {
        this.guestToken = crypto.randomUUID(); // Generate a unique guest token
        localStorage.setItem('guestToken', this.guestToken);
      }
    },
    async getUserOrders() {
      await this.initializeGuestToken();
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axiosInstance.get('/api/user/orders', {
          headers: {
            'Guest-Token': this.guestToken,
          }
        });
        this.userOrders = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order.';
        console.error('Order creation failed:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async createOrder(orderData) {
      await this.initializeGuestToken();
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axiosInstance.post('/api/orders', orderData, {
          headers: {
            'Guest-Token': this.guestToken,
          }
        });
        this.order = response.data;
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to create order.';
        console.error('Order creation failed:', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async createPaymentIntent(amount){
      try{
        const response = await axiosInstance.post("/api/create-payment-intent", amount);
        
        const clientSecret = response.data.client_secret

        return clientSecret;
      } catch (err) {
        this.error = "Failed to initialize payment.";
        return err;
      } 
    },
    // async refundPayment(transactionId) {
    //   try {
    //     await axiosInstance.post("/api/refund", { transaction_id: transactionId });
    //   } catch (error) {
    //     console.error("Refund failed:", error);
    //   }
    // },
  },
});
