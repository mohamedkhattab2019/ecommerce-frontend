<template>
    <div
      class="bg-secondary text-textPrimary rounded-lg shadow-md p-4 hover:shadow-lg cursor-pointer"
      @click="$emit('select', category.id, category.name_ar)"
    >
      <h3 class="text-lg font-bold mb-2">{{ category.name_ar }}</h3>
      <!-- <p class="text-sm text-textSecondary">{{ category.name_en }}</p> -->
    </div>
  </template>
  
  <script>
  export default {
    props: {
      category: {
        type: Object,
        required: true,
      },
    },
  };
  </script>
  