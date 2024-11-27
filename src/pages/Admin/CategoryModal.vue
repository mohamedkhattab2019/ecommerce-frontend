<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white modal p-6 rounded shadow-lg w-1/3">
        <h2 class="text-xl font-bold mb-4 text-gray-800">
          {{ category ? "Edit Category" : "Add Category" }}
        </h2>
        <form @submit.prevent="handleSubmit">
          <div class="mb-4">
            <label for="name_ar" class="block text-gray-700 font-medium">Name (Arabic)</label>
            <input
              v-model="form.name_ar"
              type="text"
              id="name_ar"
              required
              autocomplete="off"
              class="w-full border bg-white border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div class="mb-4">
            <label for="name_en" class="block text-gray-700 font-medium">Name (English)</label>
            <input
              v-model="form.name_en"
              id="name_en"
              rows="3"
              autocomplete="off"
              class="w-full border bg-white border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div class="flex justify-end">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-500 text-white px-4 py-2 rounded ml-2 hover:bg-blue-600 transition-colors"
            >
              {{ category ? "Update" : "Add" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
    import { mapState, mapActions } from "pinia"; // Use mapState for better state management
  import { useCategoriesStore } from "../../stores/categories";

  export default {
    props: {
      category: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        form: {
          name_ar: "",
          name_en: "",
        },
      };
    },
    watch: {
      category: {
        immediate: true,
        handler(newVal) {
          if (newVal) {
            this.form = { ...newVal }; // Populate form if category is provided
          } else {
            this.resetForm();
          }
        },
      },
    },
    methods: {
    ...mapActions(useCategoriesStore, ["createCategory"]),
      resetForm() {
        this.form = { name_ar: "", name_en: "" }; // Reset form fields
      },
      async handleSubmit() {
        try {
          if (this.category) {
            // Update category
            await axiosInstance.put(`/api/admin/categories/${this.category.id}`, this.form);
          } else {
            // Add new category
            this.createCategory(this.form);
          }
          this.$emit("refresh"); // Notify parent to refresh categories
          this.closeModal(); // Close the modal
        } catch (error) {
          console.error("Failed to save category:", error);
        }
      },
      closeModal() {
        this.$emit("close"); // Close modal event
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add some styles for smooth transitions and better UI */
  textarea,
  input {
    transition: all 0.3s ease-in-out;
  }
  textarea:focus,
  input:focus {
    box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
  }
  </style>
  