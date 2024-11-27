<template>
    <div class="container mx-auto p-4 bg-primary text-textPrimary">
      <h1 class="text-2xl font-bold mb-6">Categories</h1>
  
      <!-- Show loading spinner if data is still being fetched -->
      <div v-if="loading" class="text-center">
        <span class="text-tertiary">Loading...</span>
      </div>
  
      <!-- Show categories when data is loaded -->
      <div v-if="categories" class="grid  sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <CategoryCard
          v-for="category in categories"
          :key="category.id"
          :category="category"
          @select="navigateToProducts"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { mapState, mapActions } from "pinia"; // Use mapState for better state management
  import { useCategoriesStore } from "../stores/categories";
  import CategoryCard from "../components/CategoryCard.vue";
  import { useRouter } from "vue-router";
  
  export default {
    components: { CategoryCard },
    data() {
      return {
        loading: true, // For tracking loading state
      };
    },
    computed: {
      ...mapState(useCategoriesStore, ["categories"]), // Map categories from store
    },
    created() {
      // Fetch categories when component is created
      this.fetchCategories()
        .then(() => {
          this.loading = false; // Stop loading
        })
        .catch((error) => {
          console.error("Failed to load categories:", error);
          this.loading = false;
        });
    },
    methods: {
      ...mapActions(useCategoriesStore, ["fetchCategories"]), // Fetch categories action
      navigateToProducts(categoryId,categoryName) {
        console.log(categoryName)
        this.$router.push({ name: "Products", params: { categoryId} ,   query: { categoryName: categoryName }});
        
      },
    },
  };
  </script>
  