<template>
  <div class="container mx-auto p-6 bg-gray-100">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Checkout</h1>

    <form @submit.prevent="handlePayment">
      <!-- Shipping Details -->
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-700">Shipping Details</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="address" class="block text-gray-700">Address</label>
            <input v-model="shipping.address" type="text" id="address" required
              class="w-full border rounded px-3 py-2 text-black" />
          </div>
          <div>
            <label for="city" class="block text-gray-700">City</label>
            <input v-model="shipping.city" type="text" id="city" required class="w-full border rounded px-3 py-2 text-black" />
          </div>
          <div>
            <label for="zip" class="block text-gray-700">Zip Code</label>
            <input v-model="shipping.zip_code" type="text" id="zip" required class="w-full border rounded px-3 py-2 text-black" />
          </div>
          <div>
            <label for="phone" class="block text-gray-700">Phone</label>
            <input v-model="shipping.phone" type="text" id="phone" required class="w-full border rounded px-3 py-2 text-black" />
          </div>
        </div>
      </div>
      <!-- Payment Details -->
      <div class="mb-6 bg-red flex-col">
        <h2 class="text-xl font-bold text-gray-700">Payment Details</h2>
        <div class="my-6 text-tertiary flex-1 flex gap-4  content-center text-center">
          <p class="text-xl font-bold text-tertiary">Summary</p>
          <p class="self-end">الإجمالي الفرعي :{{ summary.subtotal.toFixed(2) }} ر.س  </p>
          <p class="self-end">الضريبة ({{ TAX_PERCENTAGE }}%): ر.س  {{ summary.tax.toFixed(2) }}</p>
          <p class="self-end"><strong>الإجمالي: ر.س {{ summary.total.toFixed(2) }}</strong></p>
        </div>
        <div v-if="isCreditCard">
          <label for="card" class="block text-gray-700">Credit Card</label>
          <div id="card-element" class="w-full border rounded px-3 py-2 bg-white"></div>
        </div>
      </div>

      <button :disabled="isLoading" type="submit" class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        <span v-if="isLoading">Processing...</span>
        <span v-else>Pay ${{ Number(summary.total.toFixed(2)) }}</span>
      </button>
    </form>
    <div v-if="isLoading" class="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div class="loader border-t-4 border-b-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
    </div>
  </div>
</template>

<script>
import { loadStripe } from "@stripe/stripe-js";
import { useOrderStore } from "../stores/order";
import { useCartStore } from "../stores/cart";
import { mapState, mapActions } from "pinia";
import { TAX_PERCENTAGE } from "../config";

export default {
  data() {
    return {
      shipping: {
        address: "",
        city: "",
        zip_code: "",
        phone: "",
      },
      stripe: null,
      card: null,
      isCreditCard: true,
      isLoading: false,
    };
  },
  computed: {
    ...mapState(useCartStore, ["selectedProducts", "total","selectedTotal"]),
    summary() {
      const cartStore = useCartStore();
      return cartStore.calculateSelectedTotal;
    },

  },
  async mounted() {
    this.stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    this.card = this.stripe.elements().create("card");
    this.card.mount("#card-element");
  },
  methods: {
    ...mapActions(useCartStore, ["fetchCart"]),

    async handlePayment() {
      const cartStore = useCartStore();
      const orderStore = useOrderStore();

      try {
        this.isLoading = true;
        const { total, tax } = cartStore.calculateSelectedTotal;

        const clientSecret = await orderStore.createPaymentIntent({ amount: Math.round(total * 100) });
        if (!clientSecret) {
          console.error("Failed to fetch client secret");
          return;
        }

        const { paymentIntent: confirmedIntent, error: confirmError } = await this.stripe.confirmCardPayment(
          clientSecret,
          { payment_method: { card: this.card } }
        );

        if (confirmError) {
          console.error(confirmError);
          return;
        }

        const orderData = {
          items: this.selectedProducts.map((item) => ({
            product_id: item.productId,
            quantity: item.quantity,
          })),
          shipping_details: this.shipping,
          payment_details: { payment_method: "credit_card", transaction_id: confirmedIntent.id, amount:total , tax: tax },
        };

        const newOrder = await orderStore.createOrder(orderData);
        this.fetchCart();
          this.$router.push({
            name: "OrderConfirmation",
            params: { orderId: newOrder.data.id },
            query: { orderId: newOrder.data.id }, // Pass the orderId
          });
      } catch (orderError) {
        console.error("Order failed:", orderError);
        this.$router.push("/order-failure");
      } finally{
        this.isLoading = false;
      }
    },
  },
};
</script>
