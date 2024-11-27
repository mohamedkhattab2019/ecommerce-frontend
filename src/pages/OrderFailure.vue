<template>
    <div class="container mx-auto p-6 bg-red-100">
      <h1 class="text-2xl font-bold text-red-800">Order Failed</h1>
      <p class="mt-4 text-red-700">
        We couldn't process your order. If you were charged, the amount will be refunded shortly.
      </p>
      <router-link to="/checkout" class="text-blue-500 mt-4">Try Again</router-link>
    </div>
  </template>
  