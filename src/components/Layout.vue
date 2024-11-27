<template>
  <div class="min-h-screen w-full bg-primary text-textPrimary">
    <!-- App Bar -->
    <header class="bg-secondary text-textPrimary shadow-md">
      <div class="container mx-auto flex items-center justify-between p-4">
        <!-- Logo -->
        <div class="flex items-center space-x-4">
          <img src="/logo.webp" alt="Logo" class="w-12 h-12 rounded-full" />
        </div>

        <!-- Tabs -->
        <nav class="flex space-x-6">
          <router-link
            to="/categories"
            class="hover:text-tertiary tab-bar border-0"
            :class="{ 'text-tertiary': $route.name === 'Categories' }"
          >
            تسوق
          </router-link>
          <router-link
            to="/orders"
            class="hover:text-tertiary tab-bar"
            :class="{ 'text-tertiary': $route.name === 'User Orders' }"
          >
           طلباتي
          </router-link>
          <router-link
            to="/admin/categories"
            class=" hover:text-tertiary tab-bar"
            :class="{ 'text-tertiary': $route.name === 'Admin Categories' }"
          >
          اضافة تصنيفات
          </router-link>
        </nav>

        <!-- Cart -->
        <div>
          <router-link to="/cart">
            <button class="relative bg-accent text-white px-4 py-2 rounded-md rtl">
              <span
                v-if="cartCount >= 0"
                class="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
              >
                {{ cartCount }}
              </span>
              عربة التسوق
            </button>
          </router-link>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto p-6">
      <router-view />
    </main>
  </div>
</template>

<script>
import { useCartStore } from "../stores/cart";
import { mapState, mapActions } from "pinia";

export default {
  name: "Layout",
  data: () => ({
    cartCount: 0, // Initialize cartCount
  }),
  async created() {
    await this.fetchCart(); // Fetch initial cart data
    this.updateCartCount(); // Update the cart count
  },
  computed: {
    ...mapState(useCartStore, ["cart"]),
  },
  watch: {
    cart: {
      handler(newCart) {
        this.updateCartCount(); // Update the cart count when cart changes
      },
      deep: true, // Watch for deep changes
    },
  },
  methods: {
    ...mapActions(useCartStore, ["fetchCart"]),

    updateCartCount() {
      // Safely calculate the cart count
      if (this.cart && this.cart.data) {
        this.cartCount = this.cart.data.reduce(
          (count, item) => count + item.quantity,
          0
        );
      } else {
        this.cartCount = 0;
      }
    },
  },
};
</script>
<style>
.tab-bar {
  border-left: 0.5px solid gray;
  display: inline-block;
  height: 25px; 
  padding: 0 10px 0 10px;
}

</style>