<template>
    <div class="container mx-auto p-6 bg-gray-100">
        <h1 class="text-2xl font-bold text-gray-800 mb-6 text-right">طلباتي</h1>

        <div v-if="isLoading" class="text-center">
            <p class="text-lg text-gray-500">جاري تحميل الطلبات...</p>
        </div>

        <div v-if="error" class="text-center text-red-500">
            <p>{{ error }}</p>
        </div>

        <div v-if="orders && orders.length" class="overflow-x-auto">
            <table class="table-auto w-full border-collapse border border-gray-200 rtl">
                <thead>
                    <tr class="bg-gray-100 text-right">
                        <th class="p-4 text-black border border-gray-200 hidden sm:table-cell">رقم الطلب</th>
                        <th class="p-4 text-black border border-gray-200">المجموع الجزئي (ر.س) </th>
                        <th class="p-4 text-black border border-gray-200">الضريبة (ر.س)</th>
                        <th class="p-4 text-black border border-gray-200">الإجمالي (ر.س)</th>
                        <th class="p-4 text-black border border-gray-200">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50">
                        <td class="p-4 text-black border border-gray-200 text-right hidden sm:table-cell">{{ order.id }}
                        </td>
                        <td class="p-4 text-black border border-gray-200 text-right">{{ order.subtotal }}</td>
                        <td class="p-4 text-black border border-gray-200 text-right">{{ order.tax }}</td>
                        <td class="p-4 text-black border border-gray-200 text-right font-bold">{{ order.total }}
                        </td>
                        <td class="p-4 text-black border border-gray-200 text-center relative" style="text-align: -webkit-center!important;">
                            <button @click.stop="toggleActionsMenu(order.id)"
                                class="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor" class="w-5 h-5 text-gray-700">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6v.01M12 12v.01M12 18v.01" />
                                </svg>
                            </button>
                            <ul v-if="activeMenu === order.id"
                                class="absolute bg-white shadow-lg rounded-md mt-2 right-0 w-32 text-sm z-10">
                                <li>
                                    <button @click="viewDetails(order)"
                                        class="block px-4 py-2 text-left w-full hover:bg-gray-100">
                                        التفاصيل
                                    </button>
                                </li>
                                <li>
                                    <button @click="downloadInvoice(order.id)"
                                        class="block px-4 py-2 text-left w-full hover:bg-gray-100">
                                        تحميل الملف
                                    </button>

                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- No Orders -->
        <div v-else-if="!isLoading && !error && (!orders || !orders.length)" class="text-center">
            <p class="text-gray-500">ليس لديك طلبات بعد.</p>
        </div>

        <!-- Order Details Modal -->
        <div v-if="selectedOrder" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            @click.self="closeModal">
            <div class="bg-white p-8 rounded-lg shadow-lg w-3/4 md:w-1/2">
                <!-- Header -->
                <div class="flex justify-between items-center border-b pb-4 mb-4">
                    <h2 class="text-2xl font-bold text-primary">🛒 Order #{{ selectedOrder.id }}</h2>
                    <button @click="closeModal" class="text-gray-500 hover:text-red-600 text-2xl font-bold">
                        &times;
                    </button>
                </div>

                <!-- Order Summary -->
                <div class="space-y-2">
                    <p class="text-lg text-gray-600"><strong>Subtotal:</strong> <span class="text-gray-800">{{
                            selectedOrder.subtotal }} ر.س</span></p>
                    <p class="text-lg text-gray-600"><strong>Tax:</strong> <span class="text-gray-800">{{
                            selectedOrder.tax }} ر.س</span></p>
                    <p class="text-lg text-gray-600"><strong>Total:</strong> <span class="text-green-600 font-bold">{{
                            selectedOrder.total }} ر.س</span></p>
                </div>

                <!-- Items List -->
                <div class="mt-6">
                    <h3 class="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">🛍️ Items</h3>
                    <ul class="space-y-2">
                        <li v-for="item in selectedOrder.items" :key="item.product_id"
                            class="flex justify-between items-center border-b pb-2">
                            <span class="text-gray-600 font-medium">{{ item.name }} (x{{ item.quantity }})</span>
                            <span class="text-gray-800 font-bold">{{ item.total_price }} ر.س</span>
                        </li>
                    </ul>
                </div>

                <!-- Shipping Details -->
                <div class="mt-6">
                    <h3 class="text-xl font-semibold text-gray-800 border-b pb-2 mb-4">📦 Shipping Details</h3>
                    <p class="text-gray-600"><strong>Address:</strong> {{ selectedOrder.shipping_details.address }}, {{
                        selectedOrder.shipping_details.city }}</p>
                    <p class="text-gray-600"><strong>Phone:</strong> {{ selectedOrder.shipping_details.phone }}</p>
                </div>

                <!-- Footer Buttons -->
                <div class="mt-6 text-center">
                    <button @click="closeModal"
                        class="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import axiosInstance from "../plugins/axios";
import { useOrderStore } from "../stores/order";
import { mapState, mapActions } from "pinia";

export default {
    name: "UserOrders",
    data() {
        return {
            selectedOrder: null,
            activeMenu: null,
        };
    },
    computed: {
        ...mapState(useOrderStore, ["userOrders", "isLoading", "error"]),
        orders() {
            return this.userOrders?.data || [];
        },
    },
    methods: {
        ...mapActions(useOrderStore, ["getUserOrders"]),
        async fetchOrders() {
            try {
                await this.getUserOrders();
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            }
        },
        toggleActionsMenu(orderId) {
            this.activeMenu = this.activeMenu === orderId ? null : orderId;
        },
        closeMenu() {
            this.activeMenu = null;
        },
        viewDetails(order) {
            this.selectedOrder = order;
            this.closeMenu();
        },
        closeModal() {
            this.selectedOrder = null;
        },
        async downloadInvoice(orderId) {
            try {
                const response = await axiosInstance.get(`/api/orders/${orderId}/invoice`, {
                    responseType: "blob",
                });

                const blob = new Blob([response.data], { type: "application/pdf" });
                const url = window.URL.createObjectURL(blob);

                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", `invoice-${this.orderId}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.error("Failed to download invoice:", error);
            }
        },
    },
    created() {
        this.fetchOrders();
        document.addEventListener("click", this.closeMenu);
    },
    beforeDestroy() {
        document.removeEventListener("click", this.closeMenu);
    },
};
</script>


<style scoped>
.container {
    max-width: 1200px;
}

.rtl {
    direction: rtl;
}

.table-auto th,
.table-auto td {
    text-align: right;
}
</style>