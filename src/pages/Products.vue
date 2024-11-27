<template>
  <div class="container mx-auto p-4 bg-primary text-textPrimary">
    <h1 class="text-2xl font-bold mb-6">منتجات ال{{ categoryName }}</h1>

    <div v-if="loading" class="text-center">
      <span class="text-tertiary">Loading...</span>
    </div>

    <div v-if="products" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @add-to-cart="handleAddToCart"
        @viewDetails="productDetails"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia"; 
import { useProductsStore } from "../stores/products";
import ProductCard from "../components/ProductCard.vue";
import { useCartStore } from "../stores/cart";

export default {
  components: { ProductCard },
  props: ["categoryId","categoryName"],
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    ...mapState(useProductsStore, ["products"]),
    categoryName() {
    return this.$route.query.categoryName || "Category Products";
  },
  },
  created() {
    console.log(this.categoryId,this.categoryName)
    this.fetchProducts(this.categoryId)
      .then(() => {
        this.loading = false; 
      })
      .catch((error) => {
        console.error("Failed to load products:", error);
        this.loading = false;
      });
  },
  methods: {
    ...mapActions(useProductsStore, ["fetchProducts"]),
    ...mapActions(useCartStore, ["addToCart"]),

    handleAddToCart(productId) {
      this.addToCart(productId) 
        .then(() => {
          console.log(`Product ${productId} added to cart successfully!`);
        })
        .catch((error) => {
          console.error("Failed to add product to cart:", error);
        });
    },
    productDetails(productId) {
      console.log(productId)
      this.$router.push({ name: "ProductsDetails", params: { productId } });
    },
  },
};
</script>
