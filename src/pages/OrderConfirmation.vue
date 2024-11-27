<template>
  <div class="container mx-auto p-6 bg-green-100">
    <h1 class="text-2xl font-bold text-green-800">Order Confirmed!</h1>
    <p class="mt-4 text-green-700">
      Your order has been placed successfully. Thank you for shopping with us!
    </p>
    <router-link to="/" class="text-blue-500 mt-4">Go back to Home</router-link>
    <div class="mt-6">
      <button
        @click="downloadInvoice"
        class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
      >
        Download Invoice
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import axiosInstance from "../plugins/axios";

export default {
  props: ["orderId"],
  methods: {
    async downloadInvoice() {
      try {
        const response = await axiosInstance.get(`/api/orders/${this.orderId}/invoice`, {
          responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `invoice-${this.orderId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
      } catch (error) {
        console.error("Failed to download invoice:", error);
      }
    },
  },
};
</script>
