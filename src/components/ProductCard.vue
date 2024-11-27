<template>
    <div class="bg-white rounded-md shadow-md pb-4 p-1 hover:shadow-lg w-5/6 mb-4">
      <img :src="product.image" alt="Product Image" class="w-full h-48 object-cover rounded-md mb-4" />
      <h3 class="text-lg font-bold text-gray-500 mb-2">{{ product.name_ar }}</h3>
      <p class="text-sm text-gray-500">{{ product.description_ar + product.quantity}}</p>
      <p class="text-lg font-semibold text-gray-800">{{ product.price }} ر.س</p>
      <div class="flex item-center justify-center gap-2">

        <button
          v-if="product.quantity > 0"
          class="bg-blue-500 text-white px-2 py-2 rounded-lg mt-4 hover:bg-blue-600"
          @click="$emit('add-to-cart', product.id)"
        >
          Add to Cart
        </button>
        <button
          v-else
          class="bg-red-500 text-white px-2 py-2 rounded-lg mt-4 hover:bg-blue-600"
        >
          غير متوفر
        </button>
        <button
          class="bg-blue-500 text-white px-2 py-2 rounded-lg mt-4 hover:bg-blue-600"
          @click="$emit('viewDetails', product.id)"
        >
          View Details
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      product: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  