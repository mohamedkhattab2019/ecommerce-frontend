<template>
  <div class="container mx-auto p-6">
    <h1 class="text-2xl font-bold mb-4">إدارة التصنيفات</h1>

    <!-- Add Category Button -->
    <button
      @click="openCategoryModal(null)"
      class="bg-blue-500 text-white px-4 py-2 mb-4 rounded hover:bg-blue-600"
    >
     اضافة تصنيف
    </button>

    <!-- Categories Table -->
    <table class="table-auto w-full border-collapse border border-gray-200">
      <thead>
        <tr class="bg-gray-100 text-left rounded-lg">
          <th class="p-4 border border-gray-200 text-black">ID</th>
          <th class="p-4 border border-gray-200 text-black">Arabic Name</th>
          <th class="p-4 border border-gray-200 text-black">English Name</th>
          <th class="p-4 border border-gray-200 text-black">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="category in categories"
          :key="category.id"
          class="hover:bg-tertiary cursor-pointer"
          @click="navigateToProducts(category)"
          title="اضغط لرؤية او اضافة منتجات في هذا التصنيف!"

        >
          <td class="p-4 border border-gray-200 text-white ">{{ category.id }}</td>
          <td class="p-4 border border-gray-200 text-white ">{{ category.name_ar }}</td>
          <td class="p-4 border border-gray-200 text-white ">{{ category.name_en }}</td>
          <td class="p-4 border border-gray-200 text-white ">
            <button
              @click.stop="openCategoryModal(category)"
              class="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 mr-2"
            >
              تعديل
            </button>
            <button
              @click.stop="deleteCategory(category.id)"
              class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              مسح
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Category Modal -->
    <CategoryModal
      v-if="isModalOpen"
      :category="selectedCategory"
      @close="closeCategoryModal"
      @refresh="fetchCategories"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { useCategoriesStore } from "../../stores/categories";
import CategoryModal from "./CategoryModal.vue";

export default {
  components: { CategoryModal },
  data() {
    return {
      isModalOpen: false,
      selectedCategory: null,
    };
  },
  computed: {
    ...mapState(useCategoriesStore, ["categories"]),
  },
  methods: {
    ...mapActions(useCategoriesStore, ["fetchCategories"]),
    openCategoryModal(category) {
      this.selectedCategory = category;
      this.isModalOpen = true;
    },
    closeCategoryModal() {
      this.isModalOpen = false;
      this.selectedCategory = null;
    },
    async deleteCategory(id) {
      if (confirm("Are you sure you want to delete this category?")) {
        try {
          await axiosInstance.delete(`/api/admin/categories/${id}`);
          await this.fetchCategories();
        } catch (error) {
          console.error("Failed to delete category:", error);
        }
      }
    },
    navigateToProducts(category) {
      this.$router.push({
        name: "AdminProducts",
        params: { categoryId: category.id },
        query: { categoryName: category.name_en }, // Optionally pass categoryName
      });
    }
  },
  created() {
    this.fetchCategories();
  },
};
</script>
