<template>
  <div class="container  w-full mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">Manage Products - {{ categoryName }}</h1>

    <!-- Add Product Button -->
    <button
      @click="openProductModal(null)"
      class="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600"
    >
      Add Product
    </button>

    <!-- Products Table -->
    <div class="">
  <table class="table-auto w-full border-collapse border border-gray-200">
    <thead>
      <tr class="bg-gray-100 text-left">
        <th class="p-4 border border-gray-200 text-black hidden sm:table-cell">ID</th>
        <th class="p-4 border border-gray-200 text-black">Name</th>
        <th class="p-4 border border-gray-200 text-black hidden sm:table-cell">Description</th>
        <th class="p-4 border border-gray-200 text-black">Price</th>
        <th class="p-4 border border-gray-200 text-black">Image</th>
        <th class="p-4 border border-gray-200 text-black">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="product in products"
        :key="product.id"
        class="hover:bg-tertiary cursor-pointer"
      >
        <td class="p-4 border border-gray-200 hidden sm:table-cell">{{ product.id }}</td>
        <td class="p-4 border border-gray-200">{{ product.name_ar }}</td>
        <td class="p-4 border border-gray-200 hidden sm:table-cell">{{ product.description_ar }}</td>
        <td class="p-4 border border-gray-200">{{ product.price }}$</td>
        <td class="p-4 border border-gray-200 align-center">
          <img
            :src="product.image"
            alt="Product Image"
            class="w-8 h-8 object-cover rounded-md mb-4 sm:w-10 sm:h-10"
          />
        </td>
        <td class="p-4 border border-gray-200 text-center">
          <div class="hidden sm:flex justify-center gap-2">
            <button
              @click.stop="openProductModal(product)"
              class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
            <button
              @click.stop="deleteProduct(product.id, categoryId)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>

          <!-- Small Screen Icon Dropdown -->
          <div class="relative sm:hidden" v-click-outside="closeDropdown">
            <button
              @click.stop="toggleDropdown(product.id)"
              class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                class="w-5 h-5 text-gray-700"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v.01M12 12v.01M12 18v.01"
                />
              </svg>
            </button>
            <ul
              v-if="isDropdownOpen(product.id)"
              class="absolute bg-white shadow-lg rounded-md mt-2 right-10 bottom-10 w-32 text-sm"
            >
              <li>
                <button
                  @click.stop="openProductModal(product)"
                  class="block px-4 py-2 text-left w-full text-black hover:bg-gray-100"
                >
                  Edit
                </button>
              </li>
              <li>
                <button
                  @click.stop="deleteProduct(product.id, categoryId)"
                  class="block px-4 py-2 text-left w-full  text-black z-indx-50 hover:bg-gray-100 text-red-600"
                >
                  Delete
                </button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>

    <ProductModal
      v-if="isModalOpen"
      :product="selectedProduct"
      :category-id="categoryId"
      @close="isModalOpen = false"
      @refresh="fetchProducts(categoryId)"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useProductsStore } from "../../stores/products";
import ProductModal from "./ProductModal.vue";

export default {
  components: { ProductModal },
  props: ["categoryId"],
  directives: {
    clickOutside: {
      mounted(el, binding) {
        el.clickOutsideHandler = (event) => {
          if (!el.contains(event.target)) {
            binding.value(event);
          }
        };
        document.addEventListener("click", el.clickOutsideHandler);
      },
      unmounted(el) {
        document.removeEventListener("click", el.clickOutsideHandler);
      },
    },
  },
  data() {
    return {
      isModalOpen: false,
      selectedProduct: null,
      categoryId: this.$route.params.categoryId,
      dropdownOpenId: null,
    };
  },
  computed: {
    ...mapState(useProductsStore, ["products"]),
    categoryName() {
    return this.$route.query.categoryName || "Category Products";
  },
  },
  created() {
    this.fetchProducts(this.categoryId);
  },
  methods: {
    ...mapActions(useProductsStore, ["fetchProducts", "deleteProduct"]),
    openProductModal(product) {
      this.selectedProduct = product;
      this.isModalOpen = true;
    },
    toggleDropdown(productId) {
    this.dropdownOpenId = this.dropdownOpenId === productId ? null : productId;
    },
    isDropdownOpen(productId) {
      return this.dropdownOpenId === productId;
    },
    closeDropdown() {
      this.dropdownOpenId = null;
    },
  },
};
</script>
