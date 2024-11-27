<template>
  <div class="container mx-auto p-12 bg-gray-100">
    <h1 class="text-2xl font-bold mb-6 text-tertiary text-right">عربة التسوق</h1>
    <div v-if="cart.data && cart.data.length > 0" class="p-10">
      <div class="flex items-center mb-4">
        <input type="checkbox" id="select-all" @change="toggleSelectAll" :checked="allSelected" class="mr-2" />
        <label for="select-all" class="text-gray-700 font-bold">تحديد الكل</label>
      </div>
      <div v-for="item in cart.data" :key="item.id"
        class="flex flex-col  sm:flex-row-reverse items-center justify-between gap-8 p-4  mb-4  hover:shadow-md transition-shadow border-b-2 border-gray-300">
        <input type="checkbox" class="mr-4" :value="item.productId" :checked="isSelected(item.productId)"
          @change="toggleSelection(item)" />
        <img :src="item.productImage" alt="Product Image" class="w-20 h-20 rounded-md" />
        <div class="flex-1 flex-col  text-tertiary">

          <div class="flex-1 flex flex-row-reverse ml-4 gap-4 text-tertiary">
            <h2 class="font-bold"> {{ item.productName }}</h2>
            <p class="text-tertiary">{{ item.productDesc }}</p>
            <!-- <p class="font-bold">Price: {{ item.productPrice }} EGP</p> -->
          </div>
          <div class="flex flex-row-reverse items-right">
            <div class="flex items-center border-2 border-yellow-500 rounded-full overflow-hidden">
              <!-- Decrement Button -->
              <button
                class="px-4 py-2 bg-transparent text-yellow-500 font-bold hover:bg-yellow-500 hover:text-white transition-colors"
                @click="updateQuantity(item.productId, item.quantity - 1)">
                -
              </button>

              <!-- Input Field -->
              <input type="number" class="w-12 text-center border-0 outline-none bg-gray-100" :value="item.quantity"
                @change="updateQuantity(item.productId, $event.target.value)" min="1"
                style="appearance: none; -moz-appearance: textfield;" />

              <!-- Increment Button -->
              <button
                class="px-4 py-2 bg-transparent text-yellow-500 font-bold hover:bg-yellow-500 hover:text-white transition-colors"
                @click="updateQuantity(item.productId, item.quantity + 1)">
                +
              </button>
            </div>

            <button @click="removeFromCart(item.productId)"
              class="text-tertiary mr-2 px-4 py-2 rounded-lg hover:bg-red-400">
              حذف
            </button>
          </div>
        </div>
        <div class="flex-1 flex  ml-4 gap-6 text-tertiary">

          <p class="font-bold">ر.س{{ item.productPrice }}</p>
        </div>
      </div>
      <div class="my-8">
        <h2 class="text-xl font-bold text-tertiary text-left flex">
          <span class="my-4">
            ر.س
          </span>
          <span class="my-4">

            {{ total }}
          </span>
          <span class="m-4">
            :(من السلع
          </span>
          <span class="my-4">
            {{cart.data.length}} )
          </span>
          <span class="my-4">
            الإجمالي الفرعي
          </span>
        </h2>
        <div class="flex items-center">
          <div class="flex-1">
            <button @click="clearCart" class="bg-blue-500 text-white px-4 py-2 my-4 rounded-md">
              Clear Cart
            </button>
          </div>
          <div class="flex-1">

            <router-link :to="selectedProducts.length > 0 ? '/checkout' : '#'"
              :class="{ 'pointer-events-none opacity-50': selectedProducts.length === 0 }">
              <button :disabled="selectedProducts.length === 0"
                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed">
                Proceed to Checkout {{ selectedProducts.length }}
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-xl font-bold text-tertiary">عربة التسوق فارغة للتسوق اضغط<span>
        <router-link to="/categories" class="hover:text-tertiary"
          :class="{ 'text-tertiary': $route.name === 'Categories' }">
          هنا
        </router-link>

      </span></p>
  </div>
</template>
  
  <script>
  import { useCartStore } from '../stores/cart';
  import { mapState, mapActions } from "pinia";

  export default {
  name: "Cart",
  async created() {
    await this.fetchCart();
  },
  computed: {
    ...mapState(useCartStore, ["cart", "total", "selectedProducts"]),
    allSelected() {
      return this.cart.data.length > 0 && this.cart.data.length === this.selectedProducts.length;
    },
  },

  methods: {
    ...mapActions(useCartStore, ["fetchCart", "updateQuantity", "removeFromCart", "clearCart", "addToSelected", "removeFromSelected"]),
    toggleSelection(item) {
      if (this.isSelected(item.productId)) {
        this.removeFromSelected(item.productId);
      } else {
        this.addToSelected(item);
      }
    },
    isSelected(productId) {
      return this.selectedProducts.some((item) => item.productId === productId);
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.cart.data.forEach((item) => this.addToSelected(item));
      } else {
        this.cart.data.forEach((item) => this.removeFromSelected(item.productId));
      }
    },
  },
};
  </script>
  