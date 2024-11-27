<template>
  <div class="fixed inset-0  bg-black bg-opacity-50 flex justify-center items-center">
    <div class="bg-white modal p-6 rounded shadow-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">
        {{ product ? "Edit Product" : "Add Product" }}
      </h2>
      <form @submit.prevent="handleSubmit">
        <!-- Arabic Name -->
        <div class="mb-4">
          <label for="name_ar" class="block text-gray-700">اسم المنتج عربي</label>
          <input v-model="form.name_ar" type="text" id="name_ar" required
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- English Name -->
        <div class="mb-4">
          <label for="name_en" class="block text-gray-700">اسم المنتج انجليزي</label>
          <input v-model="form.name_en" type="text" id="name_en"
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Arabic Description -->
        <div class="mb-4">
          <label for="description_ar" class="block text-gray-700">وصف المنتج عربي</label>
          <textarea v-model="form.description_ar" id="description_ar" required rows="3"
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <!-- English Description -->
        <div class="mb-4">
          <label for="description_en" class="block text-gray-700">وصف المنتج انجليزي</label>
          <textarea v-model="form.description_en" id="description_en" rows="3"
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
        </div>

        <!-- Price -->
        <div class="mb-4">
          <label for="price" class="block text-gray-700">السعر</label>
          <input v-model="form.price" type="number" id="price" required
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Quantity -->
        <div class="mb-4">
          <label for="quantity" class="block text-gray-700">الكمية</label>
          <input v-model="form.quantity" type="number" id="quantity" required
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Image Upload -->
        <div class="mb-4 text-center">
          <label for="image" class="block text-gray-700">Image</label>
          <input @change="handleImageUpload" type="file" id="image" accept="image/*"
            class="w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <!-- Show Existing Image -->
          <div v-if="form.imageUrl || form.image" class="mt-4">
            <img :src="form.imageUrl || URL.createObjectURL(form.image)" alt="Product Image"
              class="w-20 h-20 mt-4 object-cover rounded-md mb-4" />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end">
          <button type="button" @click="$emit('close')"
            class="bg-gray-200 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-300">
            Cancel
          </button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            {{ product ? "Update" : "Add" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axiosInstance from "../../plugins/axios";
import { useSnackbarStore } from "../../stores/snackbar";

export default {
  props: {
    product: {
      type: Object,
      default: null,
    },
    categoryId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name_ar: "",
        name_en: "",
        description_ar: "",
        description_en: "",
        price: "",
        quantity: "",
        image: null,
        imageUrl: "",
      },
    };
  },
  watch: {
    product: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = {
            ...newVal,
            image: null,
            imageUrl: newVal.image,
          };
        } else {
          this.resetForm();
        }
      },
    },
  },
  methods: {
    resetForm() {
      this.form = {
        name_ar: "",
        name_en: "",
        description_ar: "",
        description_en: "",
        price: "",
        quantity: "",
        image: null,
        imageUrl: "",
      };
    },
    handleImageUpload(event) {
      this.form.image = event.target.files[0];
      this.form.imageUrl = ""; 
    },
    async handleSubmit() {
      const formData = new FormData();
      formData.append("name_ar", this.form.name_ar);
      formData.append("name_en", this.form.name_en);
      formData.append("description_ar", this.form.description_ar);
      formData.append("description_en", this.form.description_en);
      formData.append("price", this.form.price);
      formData.append("category_id", this.categoryId);
      formData.append("inventory_quantity", this.form.quantity);

      if (this.form.image) {
        formData.append("image", this.form.image);
      }

      try {
        if (this.product) {
          
          await axiosInstance.post(`/api/products/${this.product.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          
          await axiosInstance.post(`/api/products`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }

        const snackbarStore = useSnackbarStore();
        snackbarStore.showSnackbarMessage({
          message: this.product ? "Product updated successfully!" : "Product added successfully!",
          duration: 3000,
          mode: "success",
        });

        this.$emit("refresh");
        this.$emit("close");
      } catch (error) {
        console.error("Failed to save product:", error);
      }
    },
  },
};
</script>