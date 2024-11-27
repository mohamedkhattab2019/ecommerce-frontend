<template>
    <div class="container mx-auto p-6 bg-gray-100">
        <div class="flex flex-wrap items-center bg-white shadow-lg rounded-lg overflow-hidden">
            <div class="w-full lg:w-1/2">
                <img :src="product.image" :alt="product.name_en" class="w-full h-96 object-cover" />
            </div>


            <div class="w-full lg:w-1/2 p-6">
                <h1 class="text-3xl font-bold text-gray-800 mb-4">
                    {{ product.name_en }}
                </h1>
                <h2 class="text-xl font-medium text-gray-600 mb-6">
                    {{ product.name_ar }}
                </h2>

                <p class="text-gray-700 mb-4">
                    {{ product.description_en }}
                </p>
                <p class="text-gray-500 mb-6">
                    {{ product.description_ar }}
                </p>

                <div class="mb-6">
                    <p class="text-xl font-bold text-green-600 rtl">
                        السعر: {{ product.price }} ر.س
                    </p>
                </div>

                <p v-if="product.quantity > 0" class="text-sm font-medium text-green-700 rtl">
                    الكمية {{ product.quantity }} قطع
                </p>
                <p v-else class="text-sm font-medium text-red-700">
                    غير متاح بالمخزن
                </p>

                <div class="flex gap-4 mt-6">
                    <button @click="handleAddToCart(product.id)"
                        class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 focus:ring-4 focus:ring-blue-200"
                        :disabled="product.quantity === 0">
                        Add to Cart
                    </button>

                    <button @click="buyNow"
                        class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 focus:ring-4 focus:ring-green-200"
                        :disabled="product.quantity === 0">
                        Buy Now
                    </button>
                </div>
            </div>
        </div>

        <div class="mt-12">
            <h2 class="text-2xl font-bold text-gray-800 mb-6">Related Products</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div v-for="related in relatedProducts" :key="related.id"
                    class="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img :src="related.image" :alt="related.name_en" class="w-full h-48 object-cover" />
                    <div class="p-4">
                        <h3 class="text-lg font-bold text-gray-800">
                            {{ related.name_en }}
                        </h3>
                        <p class="text-gray-600 text-sm">
                            {{ related.name_ar }}
                        </p>
                        <p class="text-green-600 text-sm font-bold">
                            $ {{ related.price }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions, mapState } from "pinia";
import { useProductsStore } from "../stores/products";
import { useCartStore } from "../stores/cart";

export default {
    name: "ProductDetails",
    props: ["productId"],

    data() {
        return {
            product: {},
            relatedProducts: [],
        };
    },
    async created() {
        this.product = await this.fetchProductByID(this.$route.params.productId);

        this.relatedProducts = [
            {
                id: 2,
                name_en: "Laptop",
                name_ar: "حاسوب محمول",
                price: "1000.00",
                image: "http://127.0.0.1:8000/storage/products/laptop.png",
            },
            {
                id: 3,
                name_en: "Tablet",
                name_ar: "جهاز لوحي",
                price: "300.00",
                image: "http://127.0.0.1:8000/storage/products/tablet.png",
            },
        ];
    },
    methods: {
        ...mapActions(useProductsStore, ["fetchProductByID"]),
        ...mapActions(useCartStore, ["addToCart"]),

        async buyNow() {
            try {
                await this.addToCart(this.product.id, 1)
                this.$router.push("/cart");
            } catch (error) {
                console.error("Failed to add to cart:", error);
            }
        },
        handleAddToCart(productId) {
            this.addToCart(productId)
                .then(() => {
                    console.log(`Product ${productId} added to cart successfully!`);
                })
                .catch((error) => {
                    console.error("Failed to add product to cart:", error);
                });
        },
    },
    computed: {
        ...mapState(useProductsStore, ["selectedProduct"]),
    },
};
</script>
<style scoped>
.container {
    max-width: 1200px;
}

.shadow-lg {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

h1,
h2,
h3 {
    font-family: "Arial", sans-serif;
}

button:disabled {
    cursor: not-allowed;
    opacity: 0.6;
}
</style>